var animationManager = (function(){
    var moduleOb = {};
    var registeredAnimations = [];
    var initTime = 0;
    var isPaused = true;
    var isRequestingFrames = false;
    var len = 0;

    function removeElement(ev){
        var i = 0;
        var animItem = ev.target;
        animItem.removeEventListener('destroy',removeElement);
        while(i<len) {
            if (registeredAnimations[i].animation === animItem) {
                registeredAnimations.splice(i, 1);
                i -= 1;
                len -= 1;
            }
            i += 1;
        }
    }

    function registerAnimation(element, animationData){
        if(!element){
            return null;
        }
        var i=0;
        while(i<len){
            if(registeredAnimations[i].elem == element && registeredAnimations[i].elem !== null ){
                return registeredAnimations[i].animation;
            }
            i+=1;
        }
        var animItem = new AnimationItem();
        animItem.setData(element, animationData);
        animItem.addEventListener('destroy',removeElement);
        animItem.addEventListener('play',resumePlaying);
        registeredAnimations.push({elem: element,animation:animItem});
        len += 1;
        return animItem;
    }

    function loadAnimation(params){
        var animItem = new AnimationItem();
        animItem.setParams(params);
        animItem.addEventListener('destroy',removeElement);
        animItem.addEventListener('play',resumePlaying);
        registeredAnimations.push({elem: null,animation:animItem});
        len += 1;
        return animItem;
    }


    function setSpeed(val,animation){
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.setSpeed(val, animation);
        }
    }

    function setDirection(val, animation){
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.setDirection(val, animation);
        }
    }

    function play(animation){
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.play(animation);
        }
    }

    function moveFrame (value, animation) {
        isPaused = false;
        initTime = Date.now();
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.moveFrame(value,animation);
        }
    }

    function resumePlaying() {
        if (isRequestingFrames) {
            return false;
        }
        else {
            isRequestingFrames = true;
            requestAnimationFrame(start);
        }
    }

    function resume(nowTime) {
        var elapsedTime = nowTime - initTime;
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.advanceTime(elapsedTime);
        }
        initTime = nowTime;
        requestAnimationFrameIfNeeded(resume);
    }

    function first(nowTime){
        initTime = nowTime;
        requestAnimationFrameIfNeeded(resume);
    }

    function requestAnimationFrameIfNeeded(cb) {
        for(i=0;i<len;i+=1){
            if (!registeredAnimations[i].animation.isPaused) {
                return requestAnimationFrame(cb);
            }
        }
        isRequestingFrames = false;
        return false;
    }

    function pause(animation) {
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.pause(animation);
        }
    }

    function goToAndStop(value,isFrame,animation) {
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.goToAndStop(value,isFrame,animation);
        }
    }

    function stop(animation) {
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.stop(animation);
        }
    }

    function togglePause(animation) {
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.togglePause(animation);
        }
    }

    function destroy(animation) {
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.destroy(animation);
        }
    }

    function searchAnimations(animationData, standalone, renderer){
        var animElements = document.getElementsByClassName('bodymovin');
        var i, len = animElements.length;
        for(i=0;i<len;i+=1){
            if(renderer){
                animElements[i].setAttribute('data-bm-type',renderer);
            }
            registerAnimation(animElements[i], animationData);
        }
        if(standalone && len === 0){
            if(!renderer){
                renderer = 'svg';
            }
            var body = document.getElementsByTagName('body')[0];
            body.innerHTML = '';
            var div = document.createElement('div');
            div.style.width = '100%';
            div.style.height = '100%';
            div.setAttribute('data-bm-type',renderer);
            body.appendChild(div);
            registerAnimation(div, animationData);
        }
    }

    function resize(){
        var i;
        for(i=0;i<len;i+=1){
            registeredAnimations[i].animation.resize();
        }
    }

    function start(){
        requestAnimationFrameIfNeeded(first);
    }
    //start();

    setTimeout(start,0);

    moduleOb.registerAnimation = registerAnimation;
    moduleOb.loadAnimation = loadAnimation;
    moduleOb.setSpeed = setSpeed;
    moduleOb.setDirection = setDirection;
    moduleOb.play = play;
    moduleOb.moveFrame = moveFrame;
    moduleOb.pause = pause;
    moduleOb.stop = stop;
    moduleOb.togglePause = togglePause;
    moduleOb.searchAnimations = searchAnimations;
    moduleOb.resize = resize;
    moduleOb.start = start;
    moduleOb.goToAndStop = goToAndStop;
    moduleOb.destroy = destroy;
    return moduleOb;
}());