$(document).ready(function(){
    var audioPlayer = function(){
    var id_current, i, song, isDown=false;
    songs=[
       songOne = [0, 'Say my name', 'js/audioplayer/songs/01 - John Kalligan - Say My Name.mp3', '200.8688'],
       songTwo = [1, 'Rival', 'js/audioplayer/songs/02 - John Kalligan - Rival.mp3', '199.877'],
       songThree = [2, 'She is gone', 'js/audioplayer/songs/03 - John Kalligan - She Is Gone.mp3', '256.8272'],
    ];
    var progressBar = $('#progress').slider({
        range: "min",
        min: 0,
        value: 0,
        change: function(){
            $('.audio-player__time-current').text((Math.floor($('#progress').slider("option", "value")/60) < 10 ? '0' : '') + Math.floor($('#progress').slider("option", "value")/60) + ':' + (Math.floor($('#progress').slider("option", "value")%60) < 10 ? '0' : '') + Math.floor($('#progress').slider("option", "value")%60) + '/');
        } 
    });

    $('.audio-player__progress-slide').mousedown(function(){
        isDown=true;
    });
    $('.audio-player__progress-slide').mouseleave(function(){
        
            $(document).mouseup(function(){
            if(isDown){
                isDown=false;
                if(song){
                    if(song.paused){
                        $('.audio-player__play').addClass('pause');
                        $('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').addClass('pause');
                        song.play();
                        song.currentTime = $('#progress').slider("option","value");
                    }
                    else{
                        song.currentTime = $('#progress').slider("option","value");
                    }
                }
                else{
                    playNewSong(0);
                    $('#progress').slider("option", "value", $('#progress').slider("option","value"));
                    song.currentTime = $('#progress').slider("option","value");
                }
            }
        });
        
    });
    $('.audio-player__progress-slide').mouseup(function(){
            isDown=false;
            if(song){
                if(song.paused){
                    $('.audio-player__play').addClass('pause');
                    $('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').addClass('pause');
                    song.play();
                    song.currentTime = $('#progress').slider("option","value");
                }
                else{
                    song.currentTime = $('#progress').slider("option","value");
                }
            }
            else{
                playNewSong(0);
                $('#progress').slider("option", "value", $('#progress').slider("option","value"));
                song.currentTime = $('#progress').slider("option","value");
            }
        });
    var volume = $('#volume').slider({
        orientation: "vertical",
        animate: true,
        range: "min",
        min: 0,
        max: 100,
        change: function(){
            volumeVal = $('#volume').slider("option","value") / 100;
            if(song){
                song.volume = volumeVal;
            }
        },
        value: 100
    });
    var volumeVal = $('#volume').slider("option","value") / 100;
    for (i=0; i<songs.length; i++){
       $('#songs-list').append('<div id="'+i+'" class="audio-player__list-item"><h3 class="audio-player__list-song-name"><div class="audio-player__list-play"></div>'+songs[i][1]+'</h3><span class="audio-player__list-time">'+(Math.floor(parseInt(songs[i][3])/60) < 10 ? '0' : '')+Math.floor(parseInt(songs[i][3])/60) +':'+(parseInt(songs[i][3])%60 < 10 ? '0' : '')+parseInt(songs[i][3])%60+'</span></div>'); 
    }

    playNewSong = function(id){
        $('.audio-player__play').addClass('pause');
        $('.audio-player__list-play').removeClass('pause');
        $('#'+id).find('.audio-player__list-play').addClass('pause');
        id_current = id;
        song = new Audio(songs[id][2]);
        song.addEventListener('timeupdate', function(){
            if(!$('.audio-player__progress-slide').is(':active')){
                $('#progress').slider("option", "value", song.currentTime);
            }
        });
        song.addEventListener('ended', function(){
            id_current = (id_current + 1)%3;
            song.pause();
            playNewSong(id_current);
            $('#progress').slider("option", "value", 0);
        });

        song.play();
        song.volume = volumeVal;
        $('.audio-player__song-name').text(songs[id][1]);
        $('.audio-player__time-total').text((Math.floor(songs[id][3]/60)<10? '0':'')+Math.floor(songs[id][3]/60)+':'+(Math.floor(songs[id][3]%60)<10? '0':'')+Math.floor(songs[id][3]%60));
        $('#progress').slider("option", "max", songs[id][3]);
    }
    $('.audio-player__play').click(function(){
        if(song){
            if(song.paused){
                    $(this).addClass('pause');
                    $('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').addClass('pause');
                    song.play();
                }
                else{
                    $(this).removeClass('pause');
                    $('.audio-player__list-item').filter('#'+id_current).find('.audio-player__list-play').removeClass('pause');
                    song.pause();  
                }
        }
        else {
            id_current = 0;
            playNewSong(id_current);
            $('#progress').slider("option", "value", 0);
        }
    });
    $('.audio-player__list-item').click(function(){
        var id = $(this).attr('id');
        if(song){
            if(id_current==id){
                if(song.paused){
                    $('.audio-player__play').addClass('pause');
                    $(this).find('.audio-player__list-play').addClass('pause');
                    song.play();
                }
                else{
                    $(this).find('.audio-player__list-play').removeClass('pause');
                    $('.audio-player__play').removeClass('pause');
                    song.pause();
                }
            }
            else{ 
                id_current = id;
                song.pause();
                playNewSong(id_current);
                $('#progress').slider("option", "value", 0);
            }
        }
        else{
            $('.audio-player__play').addClass('pause');
            $(this).find('.audio-player__list-play').addClass('pause');
            id_current = id;
            song = new Audio(songs[id][2]);
            $('.audio-player__time-total').text((Math.floor(songs[id][3]/60)<10? '0':'')+Math.floor(songs[id][3]/60)+':'+(Math.floor(songs[id][3]%60)<10? '0':'')+Math.floor(songs[id][3]%60));
            song.addEventListener('timeupdate', function(){
            if(!$('.audio-player__progress-slide').is(':active')){
                $('#progress').slider("option", "value", song.currentTime);
            }
            });
            song.addEventListener('ended', function(){
                id_current = (id_current + 1)%3;
                playNewSong(id_current);
                $('#progress').slider("option", "value", 0);
        });
            song.volume = volumeVal;
            song.play();
            $('.audio-player__song-name').text(songs[id][1]);
            $('#progress').slider("option", "max", songs[id][3]);
            $('#progress').slider("option", "value", 0);
        }
    });
    let songsNum = $('.audio-player__list-item:last-child').index()+1;
    $('.audio-player__next').click(function(){
            if(song){
                id_current = (id_current + 1)%songsNum;
                song.pause();
                playNewSong(id_current);
                $('#progress').slider("option", "value", 0);
            }
            else{
                id_current=1;
                playNewSong(1);
                $('#progress').slider("option", "value", 0);
            }
        });
    $('.audio-player__prev').click(function(){
            if(song){
                id_current =(id_current - 1)%songsNum;
                if(id_current==-1){ 
                    id_current=songsNum-1;
                }
                song.pause();
                playNewSong(id_current);
                $('#progress').slider("option", "value", 0);
            }
            else{
                id_current=songsNum-1;
                playNewSong(id_current);
                $('#progress').slider("option", "value", 0);
            }
        });
    }
    audioPlayer();
});