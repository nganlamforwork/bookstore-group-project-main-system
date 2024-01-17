const productsTemplateString = `
      {{#each books}}
        <div class="col-3 book-card">
          <a class="w-100" style="display: block;"href="/product/{{this._id}}">
            <div class="img-container" style="width: 100%;
                  padding-top: 150%;
                  position: relative">
              <div class="thumbnail" style="
                position: absolute;
                top: 0;
                left:0;
                right:0;
                bottom:0;
                  background-image: url('{{this.thumbnail}}');
                  background-size: cover;"></div>
              <div class="overlay fs-2">
                <i class="fa-solid fa-eye"></i>
              </div>
            </div>
            <div class="card-body text-start py-4 text-center">
              <p class="text-secondary m-0 text-uppercase">{{this.author_name}}</p>
              <h1 class="fs-3 header-font fw-bold">{{this.title}}</h1>
              <p class="text-secondary fs-5"><span>$</span>{{this.price}}</p>
            </div>
          </a>
        </div>
      {{/each}}
`;

function getParamsString() {
  const filter = $("#filter-form").serialize();
  const urlParams = new URLSearchParams(filter);

  return urlParams.toString();
}

function updateUrl(params) {
  const newUrl = window.location.pathname + "?" + params;
  history.pushState(null, "", newUrl);
}

function handleFilter(e) {
  e.preventDefault();
  let params = getParamsString();

  params = params + "&page=1"; // default page is 1

  $.ajax({
    url: "/categories/detail/filter?" + params,
    type: "GET",
    dataType: "json",
    success: function (data) {
      updateUrl(params);
      renderData(data);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function renderData(data) {
  var productsTemplate = Handlebars.compile(productsTemplateString);
  var productsHtml = productsTemplate(data);
  document.getElementById("book-cards-container").innerHTML = productsHtml;

  const paginationTemplateString = `
  <ul class="pagination">
    {{#loopTill totalPages}}
      <li class="page-item {{#ifEquals ../currentPage index}}active{{/ifEquals}}">
        <a class="page-link" style="cursor: pointer;" onclick="paging({{index}})">{{index}}</a>
      </li>
    {{/loopTill}}
  </ul>
`;

  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("loopTill", function (totalPages, options) {
    let result = "";
    for (let i = 1; i <= totalPages; i++) {
      result += options.fn({ index: i });
    }
    return result;
  });

  var paginationTemplate = Handlebars.compile(paginationTemplateString);
  var paginationHtml = paginationTemplate(data);
  document.getElementById("paginationWrapper").innerHTML = paginationHtml;
}

function paging(page) {
  let params = getParamsString();

  params = params + "&page=" + page;

  $.ajax({
    url: "/categories/detail/filter?" + params,
    type: "GET",
    dataType: "json",
    success: function (data) {
      updateUrl(params);
      renderData(data);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}
