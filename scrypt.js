const generateCatCard = (cat) => {
  return (
    `<div data-card_id=${cat.id} class="card mb-2" style="width: 18rem">
        <img
          src="${cat.image}"
          class="card-img-top"
          alt="фоточка котенка"
        />
        <div class="card-body">
          <h5 class="card-title">${cat.name}</h5>
          <p class="card-text">${cat.description}</p>
          <button type="button" data-action="open" class="btn btn-primary">Open</button>
          <button type="button" data-action="edit" class="btn btn-warning">Edit</button>
          <button type="button" data-action="delete" class="btn btn-danger">Delete</button>

        </div>
      </div>`
  )
}

$wrapper.addEventListener('click', async (event) => {
  const action = event.target.dataset.action;
  const $currentCard = event.target.closest('[data-card_id]');
  const catId = $currentCard.dataset.card_id;
   switch (action) {
    case 'delete':
      try {
        const res = await api.deleteCat(catId);
        const responce = await res.json();
        if (!res.ok) throw Error(responce.message)
        $currentCard.remove()
      } catch (error) {
        console.log(error);
      }
      break;
      
      case 'open':
        try {
          const res = await api.getCurrentCat(catId);
          const responce = await res.json();
        //   if (!res.ok) throw Error(responceOpen.message)
        //   $currentCard.remove()
        console.log(responce);
        } catch (error) {
          console.log(error);
        }
        // открывается модалка где расположена подробная информация о коте
        // должен происходить какой запрос на бек о всей информации о конкретном коте по id
        // вывести в модальном окне
      break;

    case 'edit':
      // открывается модалка с формой
      // должен происходить какой запрос на бек о всей информации о конкретном коте по id
      // форма уже предзаполнена информацией о коте
      break;

    default:
      break;
  }
})

$addBtn.addEventListener('click', () => {
  $modalAdd.classList.remove(HIDDEN_CLASS) // открываем модалку
})

// TODO: addEventListener по закрытию модалки

document.forms.add_cats_form.addEventListener('submit', async (event) => {
  event.preventDefault();
  $formErrorMsg.innerText = '';
  const data = Object.fromEntries(new FormData(event.target).entries());

  data.id = Number(data.id)
  data.age = Number(data.age)
  data.rate = Number(data.rate)
  data.favorite = data.favorite == 'on'

  const res = await api.addNewCat(data)
  if (res.ok){
    $wrapper.replaceChildren();
    getCatsFunc()
    $modalAdd.classList.add(HIDDEN_CLASS)
    return event.target.reset()
  }
  else{
    const responce = await res.json()
// $formErrorMsg.innerText = responce.message
  }


  event.target.reset() // сброс формы
  $modalAdd.classList.add(HIDDEN_CLASS) // убираем модалку
})

document.forms.add_cats_form.addEventListener('reset', async (event) => {
  console.log(event);
  event.preventDefault();
  event.target.reset() // сброс формы
  $modalAdd.classList.add(HIDDEN_CLASS) // убираем модалку
}
)
const getCatsFunc = async () => {
  const res = await api.getAllCats();

  if (res.status != 200) {
    const $errorMessage = document.createElement('p');
    $errorMessage.classList.add('error-msg');
    $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
    $wrapper.appendChild($errorMessage);  
  }
  const data = await res.json();
  
  if (data.length === 0) {
    const $notificationMessage = document.createElement('p');
    $notificationMessage.innerText = 'Список котов пуст, добавьте первого котика';
    $wrapper.appendChild($notificationMessage);  
  }

  data.forEach(cat => {
    $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
  });
}
getCatsFunc();
