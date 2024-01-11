const productsTemplate = `
{{#each books}}
        <div class='col-3'>
          <div class='book-card-container'>
            <a href='/product/{{this._id}}'>

              <div
                class='img-container'
                style="width: 100%;
      padding-top: 150%;
      background-image: url('{{this.thumbnail}}');
      background-size: cover;"
              >
              </div>
            </a>
            <div class='card-body text-center py-4'>
              <div
                style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-overflow: ellipsis;'
              >
                <a href='/product/{{this._id}}'>
                  <h1 class='fs-4 header-font fw-bold'>{{this.title}}</h1>
                </a>
              </div>
              <span class='text-secondary fs-5'>$</span>
              <span class='text-secondary fs-5'>{{this.price}}</span>
            </div>
          </div>
        </div>
      {{/each}}
`;

function getParamsString() {
  const filter = $('#filter-form').serialize();
  const urlParams = new URLSearchParams(filter);

  return urlParams.toString();
}

function updateUrl(params) {
  const newUrl = window.location.pathname + '?' + params;
  history.pushState(null, '', newUrl);
}

function handleFilter(e) {
  e.preventDefault();
  const params = getParamsString();

  $.ajax({
    url: '/category/filter',
    type: 'POST',
    dataType: 'json',
    data: params,
    success: function (data) {
      updateUrl(params);
      renderData(data);
    },
    error: function (error) {
      console.log('Error:', error);
    },
  });
}

function renderData(data) {
  var template = Handlebars.compile(productsTemplate);
  var html = template(data);
  document.getElementById('book-cards-container').innerHTML = html;
}
