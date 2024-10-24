const form = document.querySelector('.form');

function createPromise(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = parseInt(form.elements.delay.value);
  const state = form.elements.state.value;

  const shouldResolve = state === 'fulfilled';

  createPromise(delay, shouldResolve)
    .then(delay => {
      iziToast.success({
        title: '✅ Fulfilled promise',
        message: `in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: '❌ Rejected promise',
        message: `in ${delay}ms`,
        position: 'topRight',
      });
    });
});
