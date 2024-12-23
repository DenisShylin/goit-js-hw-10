document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('button[data-start]');
  const datetimePicker = document.querySelector('#datetime-picker');

  const daysValue = document.querySelector('span[data-days]');
  const hoursValue = document.querySelector('span[data-hours]');
  const minutesValue = document.querySelector('span[data-minutes]');
  const secondsValue = document.querySelector('span[data-seconds]');

  let timerId = null;
  let selectedDate = null;

  startBtn.disabled = true;

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const currentDate = new Date();
      if (selectedDates[0] <= currentDate) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startBtn.disabled = true;
      } else {
        selectedDate = selectedDates[0];
        startBtn.disabled = false;
      }
    },
  };

  flatpickr(datetimePicker, options);

  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    datetimePicker.disabled = true;

    timerId = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = selectedDate - currentTime;

      if (timeDifference <= 0) {
        clearInterval(timerId);
        updateTimerDisplay(0);
        datetimePicker.disabled = false;
        startBtn.disabled = true;
        return;
      }

      updateTimerDisplay(timeDifference);
    }, 1000);
  });

  function updateTimerDisplay(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);

    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }

  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
  console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
  console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
});
