var song
var activePlayerId
function stopSong(id){
    song.pause()
    $(`#${id}`).find(".audio-player__progress-slide").slider("option", "value", 0);
    $(`#${id}`).find(".audio-player__play").removeClass("pause")
    $(`#${id}`).find(".audio-player__list-play").removeClass("pause")
    $('#song-author_exmp').text("John Kalligan")
    $('#song-name_exmp').text("Микстейп")
}
$(document).ready(function(){
    const audioPlayerExmp = function(){
    let progressId = '#progress_exmp'
    let currentTimeId = '#time-current_exmp'
    let TotalTimeId = '#time-total_exmp'
    let playId = '#play_exmp'
    let songsListId = '#songs-list_exmp'
    let songNameId = "#song-name_exmp"
    let songAuthorId = "#song-author_exmp"
    let nextId = '#next_exmp'
    let prevId = '#prev_exmp'
    let volumeId = '#volume_exmp'
    let id_current, i, isDown=false;
    const songsExmpList=[
       [0, 'Микстейп', 'John Kalligan', 'js/audioplayer/order-song-recordings/Микстейп.mp3', '116.218776'],
       [1, 'Прости прощай', 'ATRAIDES', 'js/audioplayer/order-song-recordings/ATRAIDES - Прости прощай.mp3', '191.921633'],
       [2, 'Far Away', 'Emberlights', 'js/audioplayer/order-song-recordings/Emberlights - Far Away (ft. John Kalligan).mp3', '245.446531'],
       [3, 'Привет (минус)', 'Дмитрий Макарчук', 'js/audioplayer/order-song-recordings/Дмитрий Макарчук - Привет (минус).mp3', '187.376327'],
       [4, 'Чернила (минус)', 'John Kalligan', 'js/audioplayer/order-song-recordings/J.K. - Чернила (минус).mp3', '241.319184'],
    ];
    $(progressId).slider({
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
                            $(songsListId).find('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').addClass('pause');
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
                        $(songsListId).find('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').addClass('pause');
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
    for (i=0; i<songsExmpList.length; i++){
       $(songsListId).append('<div id="'+i+'" class="audio-player__list-item"><h3 class="audio-player__list-song-name"><div class="audio-player__list-play"></div>'+songsExmpList[i][2]+ " - " +songsExmpList[i][1]+'</h3><span class="audio-player__list-time">'+(Math.floor(parseInt(songsExmpList[i][4])/60) < 10 ? '0' : '')+Math.floor(parseInt(songsExmpList[i][4])/60) +':'+(parseInt(songsExmpList[i][4])%60 < 10 ? '0' : '')+parseInt(songsExmpList[i][4])%60+'</span></div>'); 
    }

    const playNewSong = function(id){
        $(playId).addClass('pause');
        $(songsListId).find('.audio-player__list-play').removeClass('pause');
        $(songsListId).find('#'+id).find('.audio-player__list-play').addClass('pause');
        id_current = id;
        song = new Audio(songsExmpList[id][3]);   
        song.addEventListener('timeupdate', function(){
            if(!$(progressId).is(':active')){
                $(progressId).slider("option", "value", song.currentTime);
            }
        });
        song.addEventListener('ended', function(){
            id_current = (id_current + 1) % (songsNum + 1);
            song.pause();
            playNewSong(id_current);
            $(progressId).slider("option", "value", 0);
        });

        song.play();
        song.volume = volumeVal;
        $(songNameId).text(songsExmpList[id][1]);
        $(songAuthorId).text(songsExmpList[id][2]);
        $(TotalTimeId).text((Math.floor(songsExmpList[id][4]/60)<10? '0':'')+Math.floor(songsExmpList[id][4]/60)+':'+(Math.floor(songsExmpList[id][4]%60)<10? '0':'')+Math.floor(songsExmpList[id][4]%60));
        $(progressId).slider("option", "max", songsExmpList[id][4]);
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
                    $(songsListId).find('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').addClass('pause');
                    song.play();
                }
                else{
                    $(this).removeClass('pause');
                    $(songsListId).find('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').removeClass('pause');
                    song.pause();  
                }
            }
        }
        else {
            activePlayerId = $(this).parents('.audio-player').attr('id')
            id_current = 0;
            playNewSong(id_current);
            $(progressId).slider("option", "value", 0);
        }
    });
    $(songsListId).find('.audio-player__list-item').click(function(){
        thisPlayerId = $(this).parents('.audio-player').attr('id')
        var id = $(this).index();
        if(song){
            if(thisPlayerId != activePlayerId){
                stopSong(activePlayerId)
                playNewSong(id)
                activePlayerId = thisPlayerId
            }
            else{
                if(id_current==id){
                    if(song.paused){
                        $(playId).addClass('pause');
                        $(this).find('.audio-player__list-play').addClass('pause');
                        song.play();
                    }
                    else{
                        $(this).find('.audio-player__list-play').removeClass('pause');
                        $(playId).removeClass('pause');
                        song.pause();
                    }
                }
                else{ 
                    id_current = id;
                    song.pause();
                    playNewSong(id_current);
                    $(progressId).slider("option", "value", 0);
                }
            }
        }
        else{
            activePlayerId = $(this).parents('.audio-player').attr('id')
            $(playId).addClass('pause');
            $(this).find('.audio-player__list-play').addClass('pause');
            id_current = id;
            song = new Audio(songsExmpList[id][3]);
            $(TotalTimeId).text((Math.floor(songsExmpList[id][4]/60)<10? '0':'')+Math.floor(songsExmpList[id][4]/60)+':'+(Math.floor(songsExmpList[id][4]%60)<10? '0':'')+Math.floor(songsExmpList[id][4]%60));
            song.addEventListener('timeupdate', function(){
            if(!$(progressId).is(':active')){
                $(progressId).slider("option", "value", song.currentTime);
            }
            });
            song.addEventListener('ended', function(){
                id_current = (id_current + 1) % (songsNum + 1);
                playNewSong(id_current);
                $(progressId).slider("option", "value", 0);
        });
            song.volume = volumeVal;
            song.play();
            $(songNameId).text(songsExmpList[id][1]);
            $(songAuthorId).text(songsExmpList[id][2]);
            $(progressId).slider("option", "max", songsExmpList[id][4]);
            $(progressId).slider("option", "value", 0);
        }
    });
    let songsNum = $('.audio-player__list-item:last-child').index();
    $(nextId).click(function(){
        thisPlayerId = $(this).parents('.audio-player').attr("id")
        if(song){
            if(thisPlayerId != activePlayerId){
                stopSong(activePlayerId)
                playNewSong(1)
                activePlayerId = thisPlayerId
            }
            else{
                id_current = (id_current + 1) % (songsNum + 1);
                song.pause();
                playNewSong(id_current);
                $(progressId).slider("option", "value", 0);
            }
        }
        else{
            activePlayerId = $(this).parents('.audio-player').attr("id")
            id_current=1;
            playNewSong(1);
        }
        });
    $(prevId).click(function(){
        thisPlayerId = $(this).parents('.audio-player').attr("id")
        if(song){
            if(thisPlayerId != activePlayerId){
                stopSong(activePlayerId)
                playNewSong(0)
                activePlayerId = thisPlayerId
            }
            if(id_current == 0){
                id_current = songsNum;
                song.pause();
                playNewSong(id_current);
                $(progressId).slider("option", "value", 0);
            }
            else{
                id_current--;
                song.pause();
                playNewSong(id_current);
                $(progressId).slider("option", "value", 0);
            }
        }
        else{
            activePlayerId = $(this).parents('.audio-player').attr("id")
            playNewSong(songsNum);
            $(progressId).slider("option", "value", 0);
        }
        });
    }
    audioPlayerExmp()
});