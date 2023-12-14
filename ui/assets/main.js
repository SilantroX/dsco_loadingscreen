var play = true;
var myAudio = document.getElementById("audio_loading");

const audio = myAudio;
  const volumeControl = document.getElementById('volume-control');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');

  let isDragging = false;

  function setVolume(heightPercentage) {
    volumeSlider.style.height = heightPercentage + '%';
    const volume = heightPercentage / 100;
    audio.volume = volume;
  }

  function updateVolumeIcon(heightPercentage) {
    if (heightPercentage === 0) {
      volumeIcon.className = 'fas fa-volume-off';
    } else if (heightPercentage < 50) {
      volumeIcon.className = 'fas fa-volume-down';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  }

  volumeControl.addEventListener('mousedown', () => {
    isDragging = true;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const rect = volumeControl.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;
      const heightPercentage = Math.max(0, Math.min(100, (1 - mouseY / rect.height) * 100));

      setVolume(heightPercentage);
      updateVolumeIcon(heightPercentage);
    }
  });

  volumeControl.addEventListener('click', (event) => {
    const rect = volumeControl.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    const heightPercentage = Math.max(0, Math.min(100, (1 - mouseY / rect.height) * 100));

    setVolume(heightPercentage);
    updateVolumeIcon(heightPercentage);
  });

function onKeyDown(event) {
	switch (event.keyCode) {
		case 32:
			if (play) {
				myAudio.pause();
				play = false;
			} else {
				myAudio.play();
				play = true;
			}
			break;
	}
	return false;
}

window.addEventListener("keydown", onKeyDown, false);

const messageElement = document.getElementById('message');
messageElement.innerHTML = config.message;
messageElement.style.opacity = 1;

let states = {
	'INIT_BEFORE_MAP_LOADED': {
		count: 0,
		done: 0
	},
	'MAP': {
		count: 0,
		done: 0
	},
	'INIT_AFTER_MAP_LOADED': {
		count: 0,
		done: 0
	},
	'INIT_SESSION': {
		count: 0,
		done: 0
	}
};

const handlers = {
	startInitFunctionOrder: (data) => {
		if (data.type == 'INIT_SESSION' && states['INIT_BEFORE_MAP_LOADED'].count < 1) {
			states['INIT_BEFORE_MAP_LOADED'].count = 1;
			states['INIT_BEFORE_MAP_LOADED'].done = 1;
			states['MAP'].count = 1;
			states['MAP'].done = 1;
			states['INIT_AFTER_MAP_LOADED'].count = 1;
			states['INIT_AFTER_MAP_LOADED'].done = 1;
		}

		states[data.type].count += data.count;
	},
	initFunctionInvoked: (data) => states[data.type].done++,
	startDataFileEntries: (data) => states['MAP'].count = data.count,
	performMapLoadFunction: (data) => states['MAP'].done++
};

let last = 0;

window.addEventListener('message', (e) => (handlers[e.data.eventName] || (() => {}))(e.data));

setInterval(() => {
	let progress = 0;
	for (let type in states) {
		if (states[type].done < 1 || states[type].count < 1) continue;
		progress += (states[type].done / states[type].count) * 100;
	}

	let total = Math.min(Math.round(progress / Object.keys(states).length), 100);
	if (total < last) total = last;
	last = total;

	document.getElementById('progress').value = total;
}, 100);