$(document).ready(function(){
    const audioPlayerDemo = function(){
    let progressId = '#progress_demo'
    let currentTimeId = '#time-current_demo'
    let TotalTimeId = '#time-total_demo'
    let playId = '#play_demo'
    let volumeId = '#volume_demo'
    let isDown=false;
    const songs=[
       [0, 'Демо с телефона', 'js/audioplayer/order-song-recordings/демо с телефона.mp3', '18.912653'],
    ];
    var progressBar = $(progressId).slider({
        range: "min",
        min: 0,
        value: 0,
        change: function(){
            $(currentTimeId).text((Math.floor($(progressId).slider("option", "value")/60) < 10 ? '0' : '') + Math.floor($(progressId).slider("option", "value")/60) + ':' + (Math.floor($(progressId).slider("option", "value")%60) < 10 ? '0' : '') + Math.floor($(progressId).slider("option", "value")%60) + '/');
        } 
    });

    $(progressId).mousedown(function(){
        isDown=true;
    });
    $(progressId).mouseleave(function(){
        thisPlayerId = $(this).parents('.audio-player').attr('id')
            $(document).mouseup(function(){
            if(isDown){
                isDown=false;
                if(song){
                    
                    if(thisPlayerId != activePlayerId){
                        stopSong(activePlayerId)
                        playNewSong(0)
                        activePlayerId = thisPlayerId
                    }
                    else{
                        if(song.paused){
                            $(playId).addClass('pause');
                            song.play();
                            song.currentTime = $(progressId).slider("option","value");
                        }
                        else{
                            song.currentTime = $(progressId).slider("option","value");
                        }
                    }
                }
                else{
                    activePlayerId = $(this).parents('.audio-player').attr('id')
                    playNewSong(0);
                    $(progressId).slider("option", "value", $(progressId).slider("option","value"));
                    song.currentTime = $(progressId).slider("option","value");
                }
            }
        });
    });
    $(progressId).mouseup(function(){
            isDown=false;
            thisPlayerId = $(this).parents('.audio-player').attr('id')
            if(song){
                if(thisPlayerId != activePlayerId){
                    stopSong(activePlayerId)
                    playNewSong(0)
                    activePlayerId = thisPlayerId
                }
                else{
                    if(song.paused){
                        $(playId).addClass('pause');
                        song.play();
                        song.currentTime = $(progressId).slider("option","value");
                    }
                    else{
                        song.currentTime = $(progressId).slider("option","value");
                    }
                }
            }
            else{
                activePlayerId = $(this).parents('.audio-player').attr('id')
                playNewSong(0);
                $(progressId).slider("option", "value", $(progressId).slider("option","value"));
                song.currentTime = $(progressId).slider("option","value");
            }
        });
    var volume = $(volumeId).slider({
        orientation: "vertical",
        animate: true,
        range: "min",
        min: 0,
        max: 100,
        change: function(){
            volumeVal = $(volumeId).slider("option","value") / 100;
            if(song){
                song.volume = volumeVal;
            }
        },
        value: 100
    });
    var volumeVal = $(volumeId).slider("option","value") / 100;

    const playNewSong = function(id){
        $(playId).addClass('pause');
        id_current = id;
        song = new Audio(songs[id][2]);   
        song.addEventListener('timeupdate', function(){
            if(!$(progressId).is(':active')){
                $(progressId).slider("option", "value", song.currentTime);
            }
        });
        song.addEventListener('ended', function(){
            song.pause();
            $(playId).removeClass('pause')
            $(progressId).slider("option", "value", 0);
        });

        song.play();
        song.volume = volumeVal;
        $(TotalTimeId).text((Math.floor(songs[id][3]/60)<10? '0':'')+Math.floor(songs[id][3]/60)+':'+(Math.floor(songs[id][3]%60)<10? '0':'')+Math.floor(songs[id][3]%60));
        $(progressId).slider("option", "max", songs[id][3]);
    }
    $(playId).click(function(){
        thisPlayerId = $(this).parents('.audio-player').attr('id')
        if(song){
            if(thisPlayerId != activePlayerId){
                stopSong(activePlayerId)
                playNewSong(0)
                activePlayerId = thisPlayerId
            }
            else{
                if(song.paused){
                    $(this).addClass('pause');
                    song.play();
                    }
                else{
                    $(this).removeClass('pause');
                    song.pause();  
                    }
            }
        }
        else {
            activePlayerId = $(this).parents('.audio-player').attr('id')
            id_current = 0;
            playNewSong(0);
            $(progressId).slider("option", "value", 0);
        }
    });
    }
    audioPlayerDemo()
});