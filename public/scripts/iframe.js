// // 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// // 3. This function creates an <iframe> (and YouTube player)
// //    after the API code downloads.
// var player;
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//         videoId: 'M7lc1UVf-VE',
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
// }

// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//     event.target.playVideo();
// }

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var lastEventTime = new Date();
// var lastBufferingTime = new Date();
// var expectedEvent;
// function onPlayerStateChange(event) {
//     // if (lastEventTime && new Date() - lastEventTime > 100) {
//         switch (event.data) {
//             case YT.PlayerState.ENDED:
//                 socket.emit('end');
//                 // lastEventTime = new Date();
//                 break;
//             case YT.PlayerState.PAUSED:
//                 // player.pauseVideo();
//                 if (expectedEvent == 'pause') break;
//                 socket.emit('pause', player.getCurrentTime());
//                 // lastEventTime = new Date();
//                 break;
//             case YT.PlayerState.PLAYING:
//                 // player.playVideo();
//                 if (expectedEvent == 'play') break;
//                 socket.emit('play');
//                 // this is kind of hacky, but former videos are already loaded, so when you go back and try to seek to another time, doesn't capture this data (we rely on video buffering to seek to the right spot). by emitting video buffering, we can seek to the correct spot
//                 socket.emit('buffering', player.getCurrentTime());
//                 // lastEventTime = new Date();
//                 break;
//             case YT.PlayerState.BUFFERING: // buffering occurs when video is first loaded or moved to a different time
//                 // var videoLinks = document.getElementsByClassName('videoLinks');
//                 // var currVideoLink = player.getVideoUrl();
//                 var currVideoId = player.getVideoUrl().split('v=')[1];
//                 socket.emit('buffering', player.getCurrentTime());
//                 // lastEventTime = new Date();
//                 break;
//         }
//     }
// }

// function stopVideo() {
//     player.stopVideo();
// }

//-------------------------------------------------------------------

// // 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/player_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// // 3. This function creates an <iframe> (and YouTube player)
// //    after the API code downloads.
// var player;
// function onYouTubePlayerAPIReady() {
//     player = new YT.Player('ytplayer', {
//         width: 800,
//         height: 500,
//         events: {
//             'onStateChange': onPlayerStateChange,
//             'onReady': onPlayerReady,
//             'onPlaybackRateChange': onPlaybackRateChange
//         }
//     });
// }

// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//     // do stuff here if necessary
// }

// function onPlaybackRateChange(event) {
//     socket.emit('playback rate change', window.location.href.split('/')[4], player.getPlaybackRate());
// }

// // 5. The API calls this function when the player's state changes.
// var lastEventTime = new Date();
// var lastBufferingTime = new Date();
// var expectedEvent;
// function onPlayerStateChange(event) {
//     if (lastEventTime && new Date() - lastEventTime > 100) {
//         switch (event.data) {
//             case YT.PlayerState.ENDED:
//                 socket.emit('video ended', window.location.href.split('/')[4], player.getVideoUrl().split('v=')[1]);
//                 lastEventTime = new Date();
//                 break;
//             case YT.PlayerState.PAUSED:
//                 // player.pauseVideo();
//                 if (expectedEvent == 'pause') break;
//                 socket.emit('video paused', window.location.href.split('/')[4], document.getElementById('username').innerHTML);
//                 lastEventTime = new Date();
//                 break;
//             case YT.PlayerState.PLAYING:
//                 // player.playVideo();
//                 if (expectedEvent == 'play') break;
//                 socket.emit('video played', window.location.href.split('/')[4], document.getElementById('username').innerHTML);
//                 // this is kind of hacky, but former videos are already loaded, so when you go back and try to seek to another time, doesn't capture this data (we rely on video buffering to seek to the right spot). by emitting video buffering, we can seek to the correct spot
//                 socket.emit('video buffering', window.location.href.split('/')[4], player.getCurrentTime());
//                 lastEventTime = new Date();
//                 break;
//             case YT.PlayerState.BUFFERING: // buffering occurs when video is first loaded or moved to a different time
//                 var videoLinks = document.getElementsByClassName('videoLinks');
//                 var currVideoLink = player.getVideoUrl();
//                 var currVideoId = player.getVideoUrl().split('v=')[1];
//                 socket.emit('video buffering', window.location.href.split('/')[4], player.getCurrentTime());
//                 lastEventTime = new Date();
//                 break;
//         }
//     }
// }