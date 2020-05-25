/*
    👋 Hey there, fella!
    👀 Remember, it's okay to look but:
    🚫 Don't copy. It's not nice, nor legal.
    ⭐ This site was made for RiseFM. No-one else.
    🎨 Designed and Made by PiggyPlex (PiggyPlex#9993 on Discord).
    🔧 Edited by Callum (Callum#6052 on Discord) & MegaJoshy (MegaJoshy#0001) for use in the RiseFM application.
    ⛔ Do not attempt to recreate or copy anything you see here - whether the code or the design without prior permission from PiggyPlex himself.
*/

const checkVolume = () => {
    $('.volume-slider').val($('.volume-slider').val());
    $('#stream')[0].volume = $('.volume-slider').val();
};

$('.volume-slider')
.on('click', checkVolume)
.on('mousemove', checkVolume)
.on('mousedown', checkVolume)
.on('mouseup', checkVolume);
window.onload = () => { 
    $.getJSON("../package.json", data => {
        $("#ver").html(`v${data.version}`);
    })
    let count = 0;
    setInterval(() => {
        const cd = $("#cd");
        const delay = $("#del");
        const stream = $('#stream')[0];
        if(stream.paused) {
            count++
            delay.html(count);
            cd.fadeIn("slow");
        }
    }, 1000)
}

const togglePlay = () => {
    const stream = $('#stream');
    const button = $('.play-button');
    if (stream[0].paused) {
        button.removeClass('fa-play');
        button.removeClass('fa-pause');
        button.addClass('fa-spinner-third');
        stream.attr('src', 'https://live.risefm.net/risefm');
        checkVolume();
        stream[0].play()
        .then(() => {
            button.removeClass('fa-play');
            button.removeClass('fa-spinner-third');
            button.addClass('fa-pause');
        })
        .catch(() => {
            button.removeClass('fa-pause');
            button.removeClass('fa-spinner-third');
            button.addClass('fa-play');
        });
    } else {
        stream[0].pause();
        button.removeClass('fa-pause');
        button.removeClass('fa-spinner-third');
        button.addClass('fa-play');
    };
};
const updateCountdown = () => {
    const pad = (a) => a.toString().length == 1 ? `0${a}` : a;
    const distance = new Date('May 23, 2020 19:30:00').getTime() - new Date().getTime(),
          D = Math.floor(distance / (1000 * 60 * 60 * 24)),
          h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s = Math.floor((distance % (1000 * 60)) / 1000);
    $('.countdown-days').text(pad(D));
    $('.countdown-hours').text(pad(h));
    $('.countdown-minutes').text(pad(m));
    $('.countdown-seconds').text(pad(s));
};

const updateStats = () => {
    $.get(`https://radio.risefm.net/api/nowplaying/1`, (res) => {
        const {
            listeners: {
                unique: listeners
            },
            live: {
                is_live: live,
                streamer_name: dj
            },
            now_playing: np,
            now_playing: {
                song
            }
        } = res;
        fetchJsonp('https://api.deezer.com/search/track/autocomplete?limit=1&q='+np.song.text+'&output=jsonp')
        .then(res => res.json())
        .then(res => {
            if (res.data[0]) {
                $('.song-art').attr('src', res.data[0].album.cover || `./assets/img/RiseFM.png`);
                $('.artist-image').attr('src', res.data[0].artist.picture || `./assets/img/RiseFM.png`);
            } else {
                $('.song-art').attr('src', song.art || `./assets/img/RiseFM.png`);
                $('.artist-image').attr('src', `./assets/img/RiseFM.png`);
            };
        })
        .catch((err) => {
            console.error(`Error whilst fetching from Deezer for ${np.song.text}:`, err);
            $('.song-art').attr('src', song.art || `./assets/img/RiseFM.png`);
            $('.artist-image').attr('src', `./assets/img/RiseFM.png`);
        });
        $('.song-title').text(song.title.replace(/(\(|ft|feat|with|lyric|\+).*/gi, ''));
        $('.song-artist').text(song.artist.replace(/(\(|-|with|ft|feat).*/gi, ''));
        $('.dj-name').text(live ? `DJ ${dj}` : 'Auto DJ');
        const songText = `${song.title} by ${song.artist}`;
        if (window.prevSongText != songText) {
            $('.song-text').text(songText);
            if ($('.song-text').parent().prop('scrollHeight') > $('.song-text').parent().height() + 16) {
                const t = $('<div></div>').html(songText).text(),
                      m = `<marquee direction="right" scrollamount="8">${t}</marquee>`;
                $('.song-text').html(m);
            };
        };
        window.prevSongText = songText;
        $('.listeners').text(`${listeners} Listener${listeners == 1 ? '' : 's'}`);
    })
    .fail((err) => {
        console.error(`Error whilst fetching song metadata:`, err);
        $('.song-art').attr('src', `./assets/img/RiseFM.png`);
        $('.artist-image').attr('src', `./assets/img/RiseFM.png`);
        $('.song-title').text('Stream Offline');
        $('.song-artist').text('Unknown');
        $('.dj-name').text('Stream Offline');
        $('.listeners').text('Unknown');
    });
};

updateStats();
setInterval(updateStats, 5000);
updateCountdown();
setInterval(updateCountdown, 1000);
togglePlay();

$('.play-button').click(togglePlay);
