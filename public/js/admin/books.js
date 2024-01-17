const bookTemplateString = `
{{#each books}}
          <tr>
            <td>
              <img
                src="{{this.thumbnail}}"
                alt="{{this.title}}"
                style="width: 100px"
              />
            </td>
            <td class="text-wrap">
              <div style="max-width: 300px !important;">
                {{this.title}}
              </div>
            </td>
            <td>
              {{this.category_title}}
            </td>
            <td class="text-wrap">
              <div style="max-width: 200px !important;">
              {{this.author_name}}
              </div>
            </td>
            <td>
              {{this.inventory}}
            </td>
            <td>
              <span>$</span>{{this.price}}
            </td>
            <td>
              {{this.last_updated}}
            </td>
            <td>
              <div class="flex d-flex justify-content-start gap-4">
                <a href="/admin/books/{{this._id}}" class="btn p-0">
                  <i class="fa-solid fa-eye"></i>
                </a>
                <form action="/admin/books/delete/{{this._id}}" method="POST">
                  <button type="submit" class="btn text-danger p-0">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {{/each}}
`

function renderData(data) {
  var bookTemplate = Handlebars.compile(bookTemplateString);
  var bookHtml = bookTemplate(data);
  document.getElementById("admin-book-table").innerHTML = bookHtml;

  const paginationTemplateString = `
    <ul class="pagination" style="margin-top: 1rem; padding-left: 0.3rem">
      {{#loopTill totalPages}}
      <li class="page-item {{#ifEquals ../page index}}active{{/ifEquals}}">
        <a class="page-link" style="cursor: pointer; border-radius: 0.3125rem;"
          onclick="paging({{index}})">{{index}}</a>
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
  params = "?page=" + page;

  $.ajax({
    url: "/admin/books/filter" + params,
    type: "GET",
    dataType: "json",
    success: function (data) {
      renderData(data)
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}