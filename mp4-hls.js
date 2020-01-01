
// mp4-hls transcoder node script

require('dotenv').config();
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');

const input_file = process.argv[2];
const segment_len = process.argv[3];
const base_video_name = path.basename(input_file, '.mp4');


new_line = () => console.log("\n");

const addOutput = (command, name, scale, bitrate, bitrateMax, bufferSize, segmentLenInit, segmentLen) => {
  command
  .output(name)
  .outputOptions(
    '-vf',
    scale,
    '-c:a',
    'aac',
    '-ar',
    '48000',
    '-b:a',
    '128k',
    '-c:v',
    'h264',
    '-profile:v',
    'main',
    '-crf',
    '20',
    '-g',
    '48',
    '-keyint_min',
    '48',
    '-sc_threshold',
    '0',
    '-b:v',
    bitrate,
    '-maxrate',
    bitrateMax,
    '-bufsize',
    bufferSize,
    '-hls_init_time',
    segmentLenInit,
    '-hls_time',
    segmentLen,
    '-hls_flags',
    'single_file',
    '-hls_playlist_type',
    'vod'
  );
}

if ((input_file) && ((parseInt(segment_len) > 1) && (parseInt(segment_len) <= 30))) {

  ffmpeg.ffprobe(input_file, function (err, metadata) {
    if (err) return console.log(err);

    const width = metadata.streams[0].width;
    const height = metadata.streams[0].height;

    // set initial segment length as ((dur % seg_len) + seg_len) to prevent segments less than segment_len
    let video_duration = Math.trunc(metadata.streams[0].duration)
    let init_segment_len = ((video_duration % parseInt(segment_len)) + parseInt(segment_len)).toString();

    // create sub-directory for assets
    try {
      if (!fs.existsSync(base_video_name)) {
        fs.mkdirSync(base_video_name)
      }
    } catch (err) {
      console.error(err);
      return (false);
    }
    new_line();

    const command = ffmpeg(input_file);
    const master_playlist = [
      '#EXTM3U\n#EXT-X-VERSION:4',
      `#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="English",AUTOSELECT=NO,DEFAULT=NO,URI="hls-${base_video_name}-audio.m3u8"`
    ];

    if (width >= 3840 && height >= 2160) {
      // bitrate res_w res_h  maxrate bufsize
      // (6000, 1920, 1080, 6420, 9000);
      addOutput(
        command,
        `${base_video_name}/hls-${base_video_name}-4K-20000br.m3u8`,
        'scale=w=3840:h=2160',
        '20M',
        '24M',
        '30M',
        init_segment_len,
        segment_len
      );
      master_playlist.push(
        '#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=20000000,BANDWIDTH=240000000,FRAME-RATE=24,CODECS="avc1.640028",RESOLUTION=3840x2160'
      );
      master_playlist.push(`hls-${base_video_name}-4K-20000br.m3u8`);
    }
    if (width >= 1920 && height >= 1080) {
      // bitrate res_w res_h  maxrate bufsize
      // (6000, 1920, 1080, 6420, 9000);
      addOutput(
        command,
        `${base_video_name}/hls-${base_video_name}-1080p-6000br.m3u8`,
        'scale=1920:h=1080:force_original_aspect_ratio=decrease',
        '6000k',
        '6420k',
        '9000k',
        init_segment_len,
        segment_len
      );
      master_playlist.push(
        '#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=6000000,BANDWIDTH=6420000,FRAME-RATE=24,CODECS="avc1.640028",RESOLUTION=1920x1080'
      );
      master_playlist.push(`hls-${base_video_name}-1080p-6000br.m3u8`);
    }
    if (width >= 1728 && height >= 720) {
      // bitrate res_w res_h  maxrate bufsize
      // (4500, 1728, 720, 4814, 6750);
      addOutput(
        command,
        `${base_video_name}/hls-${base_video_name}-720p-4500br.m3u8`,
        'scale=1728:h=720',
        '4500k',
        '4814k',
        '6750k',
        init_segment_len,
        segment_len
      );
      master_playlist.push(
        '#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=4500000,BANDWIDTH=4814000,FRAME-RATE=24,CODECS="avc1.640028",RESOLUTION=1728x720'
      );
      master_playlist.push(`hls-${base_video_name}-720p-4500br.m3u8`);
    }
    if (width >= 1728 && height >= 720) {
      // bitrate res_w res_h  maxrate bufsize
      // (3000, 1728, 720, 3210, 4500);
      addOutput(
        command,
        `${base_video_name}/hls-${base_video_name}-720p-3000br.m3u8`,
        'scale=w=1728:h=720',
        '3000k',
        '3210k',
        '4500k',
        init_segment_len,
        segment_len
      );
      master_playlist.push(
        '#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=3000000,BANDWIDTH=3210000,FRAME-RATE=24,CODECS="avc1.640028",RESOLUTION=1728x720'
      );
      master_playlist.push(`hls-${base_video_name}-720p-3000br.m3u8`);
    }
    if (width >= 1296 && height >= 540) {
      // bitrate res_w res_h  maxrate bufsize
      // (2000, 1296, 540, 2140, 3000);
      addOutput(
        command,
        `${base_video_name}/hls-${base_video_name}-540p-2000br.m3u8`,
        'scale=w=1296:h=540',
        '2000k',
        '2140k',
        '3000k',
        init_segment_len,
        segment_len
      );
      master_playlist.push(
        '#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=2000000,BANDWIDTH=2140000,FRAME-RATE=24,CODECS="avc1.640028",RESOLUTION=1296x540'
      );
      master_playlist.push(`hls-${base_video_name}-540p-2000br.m3u8`);
    }
    if (width >= 1032 && height >= 430) {
      // bitrate res_w res_h  maxrate bufsize
      // (1100, 1032, 430, 1176, 1650);
      addOutput(
        command,
        `${base_video_name}/hls-${base_video_name}-430p-1100br.m3u8`,
        'scale=w=1032:h=430',
        '1100k',
        '1176k',
        '1650k',
        init_segment_len,
        segment_len
      );
      master_playlist.push(
        '#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=1100000,BANDWIDTH=1176000,FRAME-RATE=24,CODECS="avc1.640028",RESOLUTION=1032x430'
      );
      master_playlist.push(`hls-${base_video_name}-432p-1100br.m3u8`);
    }
    command
      // extract audio to separate track
      .output(`${base_video_name}/hls-${base_video_name}-audio.m3u8`)
      .noVideo()
      .outputOptions(
        '-hls_init_time', init_segment_len,
        '-hls_time', segment_len,
        '-hls_flags', 'single_file',
        '-hls_playlist_type', 'vod',
      )

      .on('start', function (commandLine) {
        console.log('Spawned ffmpeg with command: \n' + commandLine);
      })
      .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
        return (false);
      })
      .on('end', function () {

        new_line();
        console.log('Processing finished');
        console.log('Audio extracted');

        master_playlist.push(''); // we may need this line break in the end
        const master_playlist_str = master_playlist.join('\n');

        fs.writeFile(`${base_video_name}/${base_video_name}-master.m3u8`, master_playlist_str, function (err) {
          if (err) throw err;
          console.log('Master file created');
          new_line();
        });
        return (true);
      })
      .run();
  });
}
else {
  console.log("Please specify input file and and segment length (1-30 sec)");
  console.log("eg: node mp4-hls tos-teaser 6 <ret>");
}
