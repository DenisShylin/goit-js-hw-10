document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('button[data-start]');
  const datetimePicker = document.querySelector('#datetime-picker');

  const daysValue = document.querySelector('span[data-days]');
  const hoursValue = document.querySelector('span[data-hours]');
  const minutesValue = document.querySelector('span[data-minutes]');
  const secondsValue = document.querySelector('span[data-seconds]');

  let timerId = null;
  let selectedDate = null;

  // Деактивируем кнопку "Start" по умолчанию
  startBtn.disabled = true;

  // Настройки для flatpickr
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const currentDate = new Date();

      if (selectedDates[0] <= currentDate) {
        iziToast.error({
          title: 'Ошибка',
          message: 'Пожалуйста, выберите дату в будущем',
        });
        startBtn.disabled = true;
      } else {
        selectedDate = selectedDates[0];
        startBtn.disabled = false;
      }
    },
  };

  // Инициализация flatpickr
  flatpickr(datetimePicker, options);

  // Добавление слушателя событий на кнопку "Start"
  startBtn.addEventListener('click', () => {
    // Деактивируем кнопку и инпут
    startBtn.disabled = true;
    datetimePicker.disabled = true;

    timerId = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = selectedDate - currentTime;

      if (timeDifference <= 0) {
        clearInterval(timerId);
        updateTimerDisplay(0);
        datetimePicker.disabled = false;
        return;
      }

      updateTimerDisplay(timeDifference);
    }, 1000);
  });

  // Функция для обновления интерфейса таймера
  function updateTimerDisplay(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);

    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }

  // Функция для форматирования чисел
  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  // Функция для конвертации миллисекунд в дни, часы, минуты, секунды
  function convertMs(ms) {
    // Количество миллисекунд в единице времени
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Оставшиеся дни
    const days = Math.floor(ms / day);
    // Оставшиеся часы
    const hours = Math.floor((ms % day) / hour);
    // Оставшиеся минуты
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Оставшиеся секунды
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
});
