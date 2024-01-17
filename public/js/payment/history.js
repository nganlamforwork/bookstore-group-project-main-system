const paymentTemplateString = `
{{#if admin}}
  <p class="header-font fw-bold fs-1 m-0 my-4">
    Withdraw History
  </p>
  <div class="table-responsive text-nowrap">
    <table class="table table-hover">
      <thead class="table-light">
        <tr>
          <th>
            Date
          </th>
          <th>
            Activity
          </th>
          <th>
            Amount
          </th>
          <th>
            Status
          </th>
        </tr>
      </thead>
      <tbody class="table-border-bottom-0">
        {{#each withdraw_transactions}}
        <tr>
          <td>
            {{this.date}}
          </td>
          <td>
            <div style="width: 400px !important;">
              {{this.activity}}
            </div>
          </td>
          {{#if this.success}}
          <td class="text-danger"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-down"></i></td>
          <td class="text-success"><i class="fa-regular fa-circle-check"></i></td>
          {{else}}
          <td class="text-danger"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-down"></i></td>
          <td class="text-danger"><i class="fa-regular fa-circle-xmark"></i></td>
          {{/if}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
  <p class="header-font fw-bold fs-1 m-0 my-4">
    Users Transactions
  </p>
  <div class="table-responsive text-nowrap">
    <table class="table table-hover">
      <thead class="table-light">
        <tr>
          <th>
            Date
          </th>
          <th>
            User
          </th>
          <th>
            Activity
          </th>
          <th>
            Amount
          </th>
          <th>
            Status
          </th>
        </tr>
      </thead>
      <tbody class="table-border-bottom-0">
        {{#each transactions}}
        <tr>
          <td>
            {{this.date}}
          </td>
          <td>
            {{this.customerId}}
          </td>
          <td>
            <div style="width: 400px !important;">
              {{this.activity}}
            </div>
          </td>
          {{#if this.success}}
          <td class="text-success"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-up"></i></td>
          <td class="text-success"><i class="fa-regular fa-circle-check"></i></td>
          {{else}}
          <td class="text-success"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-up"></i></td>
          <td class="text-danger"><i class="fa-regular fa-circle-xmark"></i></td>
          {{/if}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
  {{else}}
  <p class="header-font fw-bold fs-1 m-0 my-4">
    Payment History
  </p>
  <div class="table-responsive text-nowrap">
    <table class="table table-hover">
      <thead class="table-light">
        <tr>
          <th>
            Date
          </th>
          <th>
            Activity
          </th>
          <th>
            Amount
          </th>
          <th>
            Status
          </th>
        </tr>
      </thead>
      <tbody class="table-border-bottom-0">
        {{#each transactions}}
        <tr>
          <td>
            {{this.date}}
          </td>
          <td>
            <div style="width: 400px !important;">
              {{this.activity}}
            </div>
          </td>
          {{#if this.success}}
          {{#if this.income}}
          <td class="text-success"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-up"></i></td>
          {{else}}
          <td class="text-danger"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-down"></i></td>
          {{/if}}
          <td class="text-success"><i class="fa-regular fa-circle-check"></i></td>
          {{else}}
          {{#if this.income}}
          <td class="text-success"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-up"></i></td>
          {{else}}
          <td class="text-danger"> <span>$</span>{{this.amount}} <i class="fa fa-arrow-down"></i></td>
          {{/if}}
          <td class="text-danger"><i class="fa-regular fa-circle-xmark"></i></td>
          {{/if}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
  {{/if}}
`;

function renderData(data) {
  var paymentTemplate = Handlebars.compile(paymentTemplateString);
  var paymentHtml = paymentTemplate(data);
  document.getElementById("payment-history").innerHTML = paymentHtml;

  const paginationTemplateString = `
    <ul class="pagination" style="margin-top: 1rem; padding-left: 0.3rem">
      {{#loopTill totalPages}}
      <li class="page-item {{#ifEquals ../currentPage index}}active{{/ifEquals}}">
        <a class="page-link" style="cursor: pointer; border-radius: 0.3125rem;"
          onclick="paging({{index}})">{{index}}</a>
      </li>
      {{/loopTill}}
    </ul>
`;
  Handlebars.registerHelper("formatNumber", function (number) {
    return number?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  });

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
    url: "/paging" + params,
    type: "GET",
    dataType: "json",
    success: function (data) {
      // console.log(data);
      renderData(data);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}
