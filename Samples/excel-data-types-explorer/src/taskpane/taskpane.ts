/** Copyright (c) Microsoft Corporation. Licensed under the MIT License. */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("getData").onclick = getData;
    document.getElementById("setData").onclick = setData;
    document.getElementById("printAsJson").onclick = printAsJson;
    document.getElementById("clearForm").onclick = clearForm;
  }
});

const defaultType: string = "String";

function textInputWithLabel(inputID: string, labelText: string, altText: string): JQuery<HTMLElement>[] {
  return [
    $("<td>").append($("<label/>", { for: inputID, class: "labels" }).text(labelText)),
    $("<td>").append($("<input/>", { class: "inputBox " + inputID, type: "text", id: inputID, alt: altText }))
  ];
}

function checkboxWithLabel(inputID: string, labelText: string, altText: string): JQuery<HTMLElement> {
  return $("<div/>", { class: "checkboxes" })
    .append($("<input/>", { type: "checkbox", class: inputID, checked: true, alt: altText }))
    .append($("<label/>").text(labelText));
}

function stringContent(): JQuery<HTMLElement> {
  return basicContent("String");
}

function booleanContent(): JQuery<HTMLElement> {
  return basicContent("Boolean");
}

function doubleContent(): JQuery<HTMLElement> {
  return basicContent("Double");
}

function basicContent(contentType: string): JQuery<HTMLElement> {
  return $("<tr/>", { id: contentType, class: "fieldValueContents" }).append(
    textInputWithLabel("basicValue", "Value: ", "value input box")
  );
}

function webImageContent(): JQuery<HTMLElement>[] {
  return [
    $("<tr/>", { id: "WebImage", class: "fieldValueContents" }).append(
      textInputWithLabel("url", "Image url: ", "Image url input box")
    ),
    $("<tr/>").append(textInputWithLabel("altText", "[Recommended] Alt-text: ", "Alt-text input box"))
  ];
}

function formattedNumberContent(): JQuery<HTMLElement>[] {
  return [
    $("<tr/>", { id: "FormattedNumber", class: "fieldValueContents" }).append(
      textInputWithLabel("number", "Number: ", "Number input box")
    ),
    $("<tr/>").append(textInputWithLabel("format", "Format: ", "Format input box"))
  ];
}

function unsupportedContent(): JQuery<HTMLElement> {
  return $("<tr/>", { id: "Unsupported", class: "fieldValueContents" })
    .append($("<td/>").append($("<label/>", { for: "unsupportedValue", class: "labels" }).text("unsupportedValue: ")))
    .append(
      $("<td/>").append(
        $("<input>", {
          class: "inputBox unsupportedValue",
          disabled: true,
          type: "text",
          name: "unsupportedValue",
          id: "unsupportedValue",
          alt: "unsupportedValue input box"
        })
      )
    );
}

function createOptionsFromList(list: string[]): JQuery<HTMLElement>[] {
  var options = [];
  list.forEach(function(val) {
    const noSpaceVal = val.replace(" ", "");
    options.push($("<option/>", { class: "type" + noSpaceVal, value: noSpaceVal }).text(val));
  });

  return options;
}

function specificFieldContent(): JQuery<HTMLElement> {
  var content = entityContents(defaultType);
  var select = $("<select/>", {
    id: "dataTypeSelectEntity",
    name: "dataType",
    class: "dataTypeSelectEntity ms-Button ms-Button-label buttons",
    style: "display:block"
  });

  select[0].onchange = function() {
    var options = (select[0] as HTMLSelectElement).options;
    var valueType = options.item(options.selectedIndex).value;
    $(content)
      .children()
      .replaceWith(entityContents(valueType).children());
  };

  var options = createOptionsFromList(["String", "Double", "Boolean", "Web Image", "Formatted Number"]);
  for (var i = 0; i < options.length; ++i) {
    select.append(options[i]);
  }

  select.append($("<option/>", { class: "typeUnsupported", value: "Unsupported", disabled: true }).text("Unsupported"));

  var table = $("<table/>", { id: "fieldTable" }).append(
    $("<tbody/>").append($("<tr/>").append($("<td/>").append(select)))
  );

  return $("<div/>", { id: "specificField", class: "specificFieldContents formContents solidBorder" })
    .append(table)
    .append(content);
}

function entitySectionContent(): JQuery<HTMLElement> {
  var fields = $(`<div class="fields"/>`).append(specificFieldContent());

  var section = $(`<div class="collapsibleSection" aria-expanded="true"/>`).append(fields);

  var newFieldButton = $("<button/>", {
    id: "addField",
    class: "ms-Button ms-Button-label buttons",
    alt: "add another field to current section",
    style: "margin-left:20px;"
  }).text("Add another field");

  /** Add a new field to selected section in the entity contents */
  newFieldButton[0].onclick = function() {
    $(fields).append(specificFieldContent());
  };

  section.append(newFieldButton);

  return section;
}

function entityDefaultSection(): JQuery<HTMLElement> {
  var defaultSection = $(`<div id="defaultSection" class="sectionContents formContents solidBorder"/>`);
  var label = $("<label/>", { class: "sectionHeader" }).text("Default section: ");

  defaultSection.append([label, entitySectionContent()]);

  return defaultSection;
}

function entitySection(): JQuery<HTMLElement> {
  var element = $("<div/>", { class: "sectionContents formContents solidBorder" });
  var table1 = $(`
                  <table id="sectionTable">
                <tbody>
                  <tr class="columnTitle">
                    <td>
                      <button class="ms-Button ms-Button-label arrows" onclick="moveSectionUp(this)" alt="button to move section up" title="move section up">&#9650</button>
                      <button class="ms-Button ms-Button-label arrows" onclick="moveSectionDown(this)" alt="button to move section down" title="move section down">&#9660</button>
                    </td>
                    <td><label class="sectionHeader">Section Title:</label></td>
                    <td><input class="inputBox sectionTitle" alt="section title input box"/></td>
                    <td>
                      <button class="ms-Button ms-Button-label arrows sectionToggle" onclick="collapseSection(this)" alt="collapse section" title="collapse section" style="visibility:visible">&#x2228</button>
                    </td>
                  </tr>
                </tbody>
              </table>`);

  var removeSectionButton = $("<button/>", {
    class: "ms-Button ms-Button-label buttons",
    alt: "delete current section and its contents"
  }).text("Delete Section and its Contents");

  /** Remove the selected section in the entity contents. */
  removeSectionButton[0].onclick = function() {
    $(element).remove();
  };

  element.append(table1);
  element.append(entitySectionContent().append(removeSectionButton));

  return element;
}

/** When data type is selected. */
$(document).ready(function() {
  $("#dataTypeSelect").change(function() {
    var value = $("#dataTypeSelect option:selected");
    setSelectedType(getTypeContent(value.val().toString()));
  });

  setSelectedType(getTypeContent(defaultType));
});

function getTypeContent(valueType: string): JQuery<HTMLElement> | JQuery<HTMLElement>[] {
  switch (valueType) {
    case "String":
      return stringContent();
    case "Double":
      return doubleContent();
    case "Boolean":
      return booleanContent();
    case "FormattedNumber":
      return formattedNumberContent();
    case "WebImage":
      return webImageContent();
    case "Entity":
      return entityContent();
    case "Unsupported":
    default:
      return unsupportedContent();
  }
}

/** Create the HTML for entity contents section. */
function entityContents(valueType: string): JQuery<HTMLElement> {
  var trKey = $(`<tr>
          <td rowspan="3">
            <button class="ms-Button ms-Button-label arrows" onclick="moveFieldUp(this)" alt="button to move field up" title="move field up">&#9650</button>
            <button class="ms-Button ms-Button-label arrows" onclick="moveFieldDown(this)" alt="button to move field down" title="move field down">&#9660</button>
          </td>
          <td><label class="labels">Key:</label></td>
          <td><input class="inputBox fieldName" alt="key input box"/></td>
        </tr>`);

  var tdMetadata = $(`<td colspan="4" class="center settings"/>`);

  if (valueType == "WebImage") {
    tdMetadata.append(checkboxWithLabel("mainImage", "Make Main Image", "main image checkbox"));
    tdMetadata.append($("<br/>"));
  }

  tdMetadata.append([
    checkboxWithLabel("cardView", "Card View", "cardview checkbox"),
    checkboxWithLabel("autoComplete", "Autocomplete", "autoComplete checkbox"),
    $("<br/>"),
    checkboxWithLabel("calcCompare", "Calc Compare", "calcCompare checkbox"),
    checkboxWithLabel("dotNotation", "Dot Notation", "dotNotation checkbox"),
    $("<br/>"),
    $("<label/>").text("Sublabel: "),
    $("<input/>", { class: "sublabel", alt: "sublabel input box" })
  ]);

  var trMetadata = $(`<tr class="metadata" style="visibility:collapse"/>`).append(tdMetadata);

  var trButtons = $(`<tr/>`);
  var tdButtons = $(`<td colspan="4"/>`);
  var buttonRemoveField = $(
    `<button class="ms-Button ms-Button-label buttons" onclick="removeField(this)" alt="delete current field">Delete Field</button>`
  );

  var buttonToggleMetadata = $(
    `<button class="ms-Button ms-Button-label buttons" alt="toggle to expand or collapse metadata properties of field">More Settings</button>`
  );

  /** Function for expanding or collapsing the additional metadata contents of a
  particular input field, in the entity contents. */
  buttonToggleMetadata[0].onclick = function() {
    var visibility = trMetadata[0].style.visibility;
    if (visibility != "collapse") {
      trMetadata[0].style.visibility = "collapse";
    } else {
      trMetadata[0].style.visibility = "visible";
    }
  };

  tdButtons.append([buttonRemoveField, buttonToggleMetadata]);
  trButtons.append(tdButtons);

  return $(`<div id="entityContents"/>`).append(
    $(`<table id="fieldTable"/>`).append(
      $(`<tbody/>`)
        .append(trKey)
        .append(getTypeContent(valueType))
        .append([trMetadata, trButtons])
    )
  );
}

/** Create the HTML for the entity data type. */
function entityContent(): JQuery<HTMLElement> {
  var div = $(`<div class="contentPadding"/>`);
  var iconlabel = $(`<label class="labels"> Entity Icon: </label>`);
  var contentLabel = $(`<label class="labels contentPadding">Entity Contents:</label>`);
  var select = $(`<select id="iconSelect" name="dataType" class="ms-Button ms-Button-label buttons"/>`);
  var options = createOptionsFromList([
    "Generic",
    "Airplane",
    "Animal",
    "Apple",
    "Art",
    "Atom",
    "Bank",
    "Basketball",
    "Beaker",
    "Bird",
    "Book",
    "Bridge",
    "Briefcase",
    "Car",
    "Cat",
    "City",
    "Clouds",
    "Constellation",
    "Dinosaur",
    "Disaster",
    "DNA",
    "Dog",
    "Drama",
    "Galaxy",
    "HatGraduation",
    "Heart",
    "Languages",
    "Leaf",
    "Location",
    "Map",
    "Microscope",
    "Money",
    "Mountain",
    "MovieCamera",
    "MusicNote",
    "Notebook",
    "PartlySunnyWeather",
    "Person",
    "Planet",
    "PointScan",
    "Running",
    "Satellite",
    "Syringe",
    "Violin",
    "Wand"
  ]);

  for (var i = 0; i < options.length; ++i) {
    select.append(options[i]);
  }

  div.append(iconlabel);
  div.append(select);

  var sections = $(`<div class="sections"/>`).append(entityDefaultSection());

  var label = $(`<label for="displayString" class="labels">Entity Display Text: </label>`);
  var input = $(`<input class="inputBox displayString" type="text" id="displayString" alt="display text input box"/>`);

  var providerTable = $(`<div id="entityContents" class="solidBorder formContents"/>`).append(
    $(`<table id="fieldTable"/>`).append(
      $(`<tbody/>`)
        .append(
          $("<tr/>").append(
            textInputWithLabel("providerDescription", "Description: ", "Provider description input box")
          )
        )
        .append(
          $("<tr/>").append(textInputWithLabel("providerTarget", "Provider address: ", "Provider source input box"))
        )
        .append($("<tr/>").append(textInputWithLabel("providerLogo", "Logo address: ", "Provider logo input box")))
    )
  );

  var referencedValuesLabel = $(`<label for="referencedValues" class="labels">Referenced values: </label>`);
  var referencedValuesInput = $(
    `<input class="inputBox displayString" type="text" id="referencedValues" alt="referencedValues text isplay box" disabled/>`
  );
  var referencedValuesClearButton = $("<button/>", {
    id: "clearReferencedValue",
    class: "ms-Button ms-Button-label buttons",
    text: "Clear referencedValues"
  });

  var referencedValuesDiv = $("<div/>", { id: "referencedValuesDiv" })
    .append(referencedValuesLabel)
    .append(referencedValuesInput)
    .append(referencedValuesClearButton);

  referencedValuesDiv[0].style.display = "none";

  referencedValuesClearButton[0].onclick = function() {
    referencedValuesInput.val("");
    referencedValuesDiv[0].style.display = "none";
  };

  var collapseProviderInfo = $("<button/>", {
    class: "ms-Button ms-Button-label sectionToggle arrows",
    alt: "collapse section",
    title: "collapse section"
  }).text("\u2228");

  collapseProviderInfo[0].onclick = function() {
    if (providerTable[0].style.display == "none") {
      providerTable[0].style.display = "block";
      collapseProviderInfo.text("\u2228");
      collapseProviderInfo[0].setAttribute("alt", "collapse section");
      collapseProviderInfo[0].setAttribute("title", "collapse section");
    } else {
      providerTable[0].style.display = "none";
      collapseProviderInfo.text("\u2227");
      collapseProviderInfo[0].setAttribute("alt", "expand section");
      collapseProviderInfo[0].setAttribute("title", "expand section");
    }
  };

  var providerInfo = $("<div/>", { class: "contentPadding" })
    .append($("<label/>", { class: "labels" }).text("Provider info: "))
    .append(collapseProviderInfo)
    .append(providerTable);

  var element = $(`<tr id="Entity"/>`).append(
    $(`<td colspan="2"/>`)
      .append([label, input])
      .append(div)
      .append(providerInfo)
      .append(referencedValuesDiv)
      .append(contentLabel)
      .append(sections)
      .append(
        $(
          `<button id="addSection" onclick="addSection()" class="ms-Button ms-Button-label buttons" style="margin-left:20px;" alt="add another section to entity contents">Add another section</button>`
        )
      )
  );

  return element;
}

/** Create the HTML for when boolean, string, or double data types are selected */
function setSelectedType(selected: JQuery<HTMLElement>[] | JQuery<HTMLElement>) {
  var element = $(`<div class= "backgroundColorForm solidBorder"/>`);
  element.append(selected);

  $(".backgroundColorForm").replaceWith(element);
}

/** Add another section in entity contents. */
function addSection() {
  $(".sections").append(entitySection());
}

/** Add a new field to the entity contents. */
function addField(element: HTMLButtonElement) {
  // append specificFieldContents to the fieldsDiv.
  const fieldsDiv = element.parentElement.previousElementSibling;
  $(fieldsDiv).append(specificFieldContent());
}
/** Move a field down in the entity contents order. */
function moveFieldDown(element: HTMLButtonElement) {
  const curSpecificField = element.parentElement.parentElement.parentElement.parentElement.parentElement
    .parentElement as HTMLDivElement;
  const nextSpecificField = curSpecificField.nextElementSibling as HTMLDivElement;
  if (nextSpecificField) {
    $(curSpecificField).remove();
    $(nextSpecificField).after(curSpecificField);
  } else {
    const curSectionContents = curSpecificField.parentElement.parentElement.parentElement as HTMLDivElement;
    const nextSectionContents = curSectionContents.nextElementSibling as HTMLDivElement;
    if (nextSectionContents) {
      const nextSectionFields = $(nextSectionContents).find(".fields");
      $(curSpecificField).remove();
      nextSectionFields.prepend(curSpecificField);
    }
  }
}
/** Move a section down in the entity contents order. */
function moveSectionDown(element: HTMLButtonElement) {
  const curSpecificSection = element.parentElement.parentElement.parentElement.parentElement
    .parentElement as HTMLDivElement;
  const nextSpecificSection = curSpecificSection.nextElementSibling as HTMLDivElement;
  if (nextSpecificSection) {
    $(curSpecificSection).remove();
    $(nextSpecificSection).after(curSpecificSection);
  }
}
/** Move a field up in the entity contents order/ */
function moveFieldUp(element: HTMLButtonElement) {
  const curSpecificField = element.parentElement.parentElement.parentElement.parentElement.parentElement
    .parentElement as HTMLDivElement;
  const prevSpecificField = curSpecificField.previousElementSibling as HTMLDivElement;
  if (prevSpecificField) {
    $(curSpecificField).remove();
    $(prevSpecificField).before(curSpecificField);
  } else {
    const curSectionContents = curSpecificField.parentElement.parentElement.parentElement as HTMLDivElement;
    const prevSectionContents = curSectionContents.previousElementSibling as HTMLDivElement;
    if (prevSectionContents) {
      const prevSectionFields = $(prevSectionContents).find(".fields");
      $(curSpecificField).remove();
      prevSectionFields.append(curSpecificField);
    }
  }
}
/** Move a section up in the entity contents order. */
function moveSectionUp(element: HTMLButtonElement) {
  const curSpecificSection = element.parentElement.parentElement.parentElement.parentElement
    .parentElement as HTMLDivElement;
  const prevSpecificSection = curSpecificSection.previousElementSibling as HTMLDivElement;
  if (prevSpecificSection && prevSpecificSection.id != "defaultSection") {
    $(curSpecificSection).remove();
    $(prevSpecificSection).before(curSpecificSection);
  }
}

/** Function for expanding section contents in the entity contents. */
function expandSection(element: HTMLButtonElement) {
  // element.parentElement.parentElement.parentElement.parentElement.nextElementSibling.style.display = "block";
  $(element).replaceWith(
    `<button class="ms-Button ms-Button-label arrows sectionToggle" onclick="collapseSection(this)" alt="collapse section" title="collapse section">&#x2228</button>`
  );
}
/** Function for collapsing section contents in the entity contents. */
function collapseSection(element: HTMLButtonElement) {
  // element.parentElement.parentElement.parentElement.parentElement.nextElementSibling.style.display = "none";
  $(element).replaceWith(
    `<button class="ms-Button ms-Button-label arrows sectionToggle" onclick="expandSection(this)" alt="expand section" title="expand section" >&#x2227 </button>`
  );
}

/** Function for printing the inputted data into the console. */
function printAsJson() {
  console.log(JSON.stringify(createValueAsJson()));
}

/** Function for assigning the inputted data to the active cell as the appropriate data type. */
function createValueAsJson(): Excel.CellValue {
  var values = $("#dataTypeSelect option:selected");
  switch (values.val()) {
    case "String":
      var stringValue = $("#basicValue")
        .val()
        .toString();
      return {
        type: Excel.CellValueType.string,
        basicValue: stringValue
      } as Excel.StringCellValue;

    case "Double":
      var doubleValue = Number($("#basicValue").val());
      if (!isNaN(doubleValue)) {
        return {
          type: Excel.CellValueType.double,
          basicValue: doubleValue
        } as Excel.DoubleCellValue;
      } else {
        alert("Type 'Double' selected but input was not a double.");
      }
      break;

    case "Boolean":
      var booleanValue = $("#basicValue")
        .val()
        .toString();
      if (booleanValue.toLowerCase() === "true") {
        return {
          type: Excel.CellValueType.boolean,
          basicValue: true
        } as Excel.BooleanCellValue;
      } else if (booleanValue.toLowerCase() === "false") {
        return {
          type: Excel.CellValueType.boolean,
          basicValue: false
        } as Excel.BooleanCellValue;
      } else {
        alert("Type 'Boolean' selected but input was not a boolean.");
      }
      break;

    case "Entity":
      return setEntity();

    case "WebImage":
      var url = $("#url")
        .val()
        .toString();
      var altText = $("#altText")
        .val()
        .toString();
      return {
        type: Excel.CellValueType.webImage,
        address: url,
        altText: altText
      };

    case "FormattedNumber":
      var doubleValue = Number($("#number").val());
      var format = $("#format").val();
      if (!isNaN(doubleValue)) {
        return {
          type: Excel.CellValueType.formattedNumber,
          basicValue: doubleValue,
          numberFormat: format
        } as Excel.FormattedNumberCellValue;
      } else {
        alert("Type 'FormattedNumber' selected but input was not a number.");
      }
      break;
  }
}
async function setData() {
  await Excel.run(async (context) => {
    const activeCell = context.workbook.getActiveCell();
    activeCell.valuesAsJson = [[createValueAsJson()]];
    await tryCatch(context.sync);
  });
}
/** Function for assigning the inputted entity contents to an entity. */
function setEntity() {
  const display: string = $("#displayString")
    .val()
    .toString();
  var iconName: string = $("#iconSelect option:selected").val() as string;
  const referencedValues: string = $("#referencedValues").val() as string;
  const fields = valuesFromQuery(".fieldName");
  const values = fieldValuesContentsFromQuery();
  const cardViews = valuesFromQuery(".cardView");
  const autoCompletes = valuesFromQuery(".autoComplete");
  const calcCompares = valuesFromQuery(".calcCompare");
  const dotNotation = valuesFromQuery(".dotNotation");
  const sublabels = valuesFromQuery(".sublabel");
  var mainImage = valuesFromQuery(".mainImage");
  var providerInfo = [
    valuesFromQuery("#providerDescription"),
    valuesFromQuery("#providerTarget"),
    valuesFromQuery("#providerLogo")
  ];
  var mainImageExists = false;
  var mainImageKey;
  var sectionArray = [];
  var jqSectionContents = $(".sectionContents");

  var fDefaultSection: Boolean = true;
  while (jqSectionContents.length > 0) {
    const first = jqSectionContents.first();
    var children = first.find(".fieldName");
    var sectionTitle = first.find(".sectionTitle");
    var properties = [];
    for (var i = 0; i < children.length; ++i) {
      var val = $(children[i]).val();
      properties.push(val);
    }

    // First section is the default; not really a section.
    if (fDefaultSection) {
      fDefaultSection = false;
      jqSectionContents = jqSectionContents.slice(1);
      continue;
    }

    var sectionEntry = {
      layout: "List",
      title: sectionTitle.val(),
      properties: properties
    };
    sectionArray.push(sectionEntry);
    jqSectionContents = jqSectionContents.slice(1);
  }

  var entity: Excel.EntityCellValue = {
    type: Excel.CellValueType.entity,
    text: display,
    properties: {},
    layouts: {
      card: {},
      compact: {}
    }
  };

  if (providerInfo[0][0] != "" || providerInfo[1][0] != "" || providerInfo[2][0] != "") {
    entity.provider = {
      description: providerInfo[0][0],
      logoTargetAddress: providerInfo[1][0],
      logoSourceAddress: providerInfo[2][0]
    };
  }

  for (var i = 0; i < fields.length; ++i) {
    var curSectionFields = [];
    const field = fields[i];
    var value = values[i];
    if (field == "" || value == "") {
      break;
    }
    var featureIntegration = {};
    if (!cardViews[i]) {
      featureIntegration["cardView"] = true;
    }
    if (!autoCompletes[i]) {
      featureIntegration["autoComplete"] = true;
    }
    if (!calcCompares[i]) {
      featureIntegration["calcCompare"] = true;
    }
    if (!dotNotation[i]) {
      featureIntegration["dotNotation"] = true;
    }
    var propertyMetadata = {};
    if (Object.keys(featureIntegration).length > 0) {
      propertyMetadata["excludeFrom"] = featureIntegration;
    }
    if (sublabels[i] != "") {
      propertyMetadata["sublabel"] = sublabels[i];
    }
    if (value.type == "WebImage") {
      if (mainImage[0] && !mainImageExists) {
        mainImageKey = field;
        mainImageExists = true;
      }
      mainImage = mainImage.slice(1);
    }

    if (Object.keys(propertyMetadata).length > 0) {
      value["propertyMetadata"] = propertyMetadata;
    }
    entity.properties[field] = value;
  }
  if (mainImageExists) {
    entity.layouts.card = {
      mainImage: {
        property: mainImageKey
      },
      sections: sectionArray
    };
  } else {
    entity.layouts.card = {
      sections: sectionArray
    };
  }
  // addCachedRefs(entity);

  if (referencedValues != "") {
    entity.referencedValues = JSON.parse(referencedValues);
  }

  if (iconName != "Generic") {
    entity.layouts.compact["icon"] = iconName;
  }
  return entity;
}
/** Helper function for retrieving jQuery values for setEntity(). */
function valuesFromQuery(query: string) {
  var jq = $(query);
  var result = [];
  while (jq.length > 0) {
    const first = jq.first();
    if (first.is("input[type=checkbox]")) {
      result.push(first.prop("checked"));
    } else {
      result.push(first.val());
    }
    jq = jq.slice(1);
  }
  return result;
}
/** Helper function for retrieving fieldValue contents for jQuery for setEntity(). */
function fieldValuesContentsFromQuery() {
  var jqFieldContents = $(".fieldValueContents");
  var jqBasicValue = $(".basicValue");
  var jqUrl = $(".url");
  var jqNumber = $(".number");
  var jqFormat = $(".format");
  var jqAltText = $(".altText");
  var jqUnsupportedValue = $(".unsupportedValue");
  var values = [];
  while (jqFieldContents.length > 0) {
    const first = jqFieldContents.first();
    var valueType = first.attr("id");
    var value;
    switch (valueType) {
      case "String":
        value = {
          type: Excel.CellValueType.string,
          basicValue: jqBasicValue
            .first()
            .val()
            .toString()
        } as Excel.StringCellValue;
        jqBasicValue = jqBasicValue.slice(1);
        break;
      case "FormattedNumber":
        var doubleValue = Number(jqNumber.first().val());
        if (!isNaN(doubleValue)) {
          value = {
            type: Excel.CellValueType.formattedNumber,
            basicValue: doubleValue,
            numberFormat: jqFormat
              .first()
              .val()
              .toString()
          };
        } else {
          alert("Type 'FormattedNumber' selected but input was not a number.");
        }
        jqNumber = jqNumber.slice(1);
        jqFormat = jqFormat.slice(1);
        break;
      case "Double":
        var doubleValue = Number(jqBasicValue.first().val());
        if (!isNaN(doubleValue)) {
          value = {
            type: Excel.CellValueType.double,
            basicValue: doubleValue
          } as Excel.DoubleCellValue;
        } else {
          alert("Type 'Double' selected but input was not a double.");
        }
        jqBasicValue = jqBasicValue.slice(1);
        break;
      case "Boolean":
        var booleanValue = jqBasicValue
          .first()
          .val()
          .toString();
        if (booleanValue.toLowerCase() === "true") {
          value = {
            type: Excel.CellValueType.boolean,
            basicValue: true
          } as Excel.BooleanCellValue;
        } else if (booleanValue.toLowerCase() === "false") {
          value = {
            type: Excel.CellValueType.boolean,
            basicValue: false
          } as Excel.BooleanCellValue;
        } else {
          alert("Type 'Boolean' selected but input was not a boolean.");
        }
        jqBasicValue = jqBasicValue.slice(1);
        break;
      case "WebImage":
        value = {
          type: Excel.CellValueType.webImage,
          address: jqUrl.first().val(),
          altText: jqAltText.first().val()
        } as Excel.WebImageCellValue;
        jqUrl = jqUrl.slice(1);
        jqAltText = jqAltText.slice(1);
        break;
      case "Unsupported":
        value = JSON.parse(
          jqUnsupportedValue
            .first()
            .val()
            .toString()
        );
        jqUnsupportedValue = jqUnsupportedValue.slice(1);
        break;
    }
    values.push(value);
    jqFieldContents = jqFieldContents.slice(1);
  }

  return values;
}
/** Function for removing a selected input field in the entity contents. */
function removeField(element: HTMLButtonElement) {
  // removes specificField
  element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
}

/** Function for retrieving the contents of a selected entity and putting them in the form boxes. */
function getEntity(value) {
  var sections;
  if (value.layouts != undefined && value.layouts.card != undefined) {
    sections = value.layouts.card.sections;
  }

  // If there is no section, make one
  if (sections == undefined) {
    const propertyKeys = Object.keys(value.properties);
    sections = [
      {
        layout: "List",
        properties: propertyKeys
      }
    ];
  }

  if (value.referencedValues != undefined) {
    $("#referencedValues").val(JSON.stringify(value.referencedValues));
    $("#referencedValuesDiv")[0].style.display = "block";
  } else {
    $("#clearReferencedValue")[0].onclick(null);
  }

  if (value.provider != undefined) {
    if (value.provider.description != undefined) {
      $("#providerDescription").val(value.provider.description);
    }

    if (value.provider.description != undefined) {
      $("#providerTarget").val(value.provider.logoTargetAddress);
    }

    if (value.provider.description != undefined) {
      $("#providerLogo").val(value.provider.logoSourceAddress);
    }
  }

  var propertyKeysOrdered = [];
  for (var i = 0; i < sections.length; ++i) {
    if (i != 0) {
      addSection();
    }
    $(".sectionTitle")
      .last()
      .val(sections[i].title);
    var sectionKeys = sections[i].properties;
    $(".specificFieldContents")
      .last()
      .remove();
    for (var j = 0; j < sectionKeys.length; ++j) {
      $(".fields")
        .last()
        .append(specificFieldContent());
      const propertyName = sectionKeys[j];
      propertyKeysOrdered.push(propertyName);
      const propertyValue = value.properties[propertyName];
      const entityContentsDiv = $(".dataTypeSelectEntity")
        .last()
        .parent()
        .parent()
        .parent()
        .parent()
        .next()
        .children();
      switch (propertyValue.type) {
        case "Double":
          $(".dataTypeSelectEntity")
            .last()
            .val("Double");
          entityContentsDiv.replaceWith(entityContents(propertyValue.type).children());
          break;
        case "Boolean":
          $(".dataTypeSelectEntity")
            .last()
            .val("Boolean");
          entityContentsDiv.replaceWith(entityContents(propertyValue.type).children());
          break;
        case "FormattedNumber":
          $(".dataTypeSelectEntity")
            .last()
            .val("FormattedNumber");
          entityContentsDiv.replaceWith(entityContents(propertyValue.type).children());
          break;
        case "WebImage":
          $(".dataTypeSelectEntity")
            .last()
            .val("WebImage");
          entityContentsDiv.replaceWith(entityContents(propertyValue.type).children());
          const firstMetadataElement = $(".cardView")
            .last()
            .parent();
          firstMetadataElement.before(`<div class="checkboxes">
                  <input type="checkbox" class="mainImage" alt="main image checkbox"/>
                  <label>Make Main Image</label>
                </div><br>`);
          break;
        case "String":
          $(".dataTypeSelectEntity")
            .last()
            .val("String");
          entityContentsDiv.replaceWith(entityContents(propertyValue.type).children());
          break;
        default:
          /*unsupported*/
          $(".dataTypeSelectEntity")
            .last()
            .val("Unsupported");
          entityContentsDiv.replaceWith(entityContents("Unsupported").children());
          break;
      }
    }
  }

  // Write the entity's data into the table.
  $("#displayString").val(value.text);
  if (value.layouts == undefined || value.layouts.compact == undefined) $("#iconSelect").val("Generic");
  else if (value.layouts.compact["icon"] != undefined) {
    $("#iconSelect").val(value.layouts.compact["icon"]);
  }
  var jqFields = $(".fieldName");
  var jqCardView = $(".cardView");
  var jqAutoComplete = $(".autoComplete");
  var jqCalcCompare = $(".calcCompare");
  var jqDotNotation = $(".dotNotation");
  var jqSublabel = $(".sublabel");
  var jqBasicValue = $(".basicValue");
  var jqUrl = $(".url");
  var jqNumber = $(".number");
  var jqFormat = $(".format");
  var jqAltText = $(".altText");
  var jqMainImage = $(".mainImage");
  var jqUnsupportedValue = $(".unsupportedValue");

  for (var i = 0; i < propertyKeysOrdered.length; ++i) {
    const propertyName = propertyKeysOrdered[i];
    const propertyValue = value.properties[propertyName];
    jqFields.first().val(propertyName);
    switch (propertyValue.type) {
      case "Double":
      case "Boolean":
      case "String":
        jqBasicValue.first().val(propertyValue.basicValue);
        jqBasicValue = jqBasicValue.slice(1);
        break;
      case "WebImage":
        jqUrl.first().val(propertyValue.address);
        jqAltText.first().val(propertyValue.altText);
        jqUrl = jqUrl.slice(1);
        jqAltText = jqAltText.slice(1);
        if (value.layouts != undefined)
          if (value.layouts.card["mainImage"] != undefined) {
            if (value.layouts.card.mainImage.property == propertyName) {
              jqMainImage.first().prop("checked", true);
            }
          }
        break;
      case "FormattedNumber":
        jqNumber.first().val(propertyValue.basicValue);
        jqFormat.first().val(propertyValue.numberFormat);
        jqNumber = jqNumber.slice(1);
        jqFormat = jqFormat.slice(1);
        break;
      default:
        jqUnsupportedValue.first().val(JSON.stringify(propertyValue));
        jqUnsupportedValue = jqUnsupportedValue.slice(1);
        break;
    }
    var featureIntegration: Excel.CellValuePropertyMetadataExclusions = {
      cardView: false,
      autoComplete: false,
      calcCompare: false,
      dotNotation: false
    };
    var sublabel = "";
    if (typeof propertyValue.propertyMetadata == "object") {
      if (typeof propertyValue.propertyMetadata.excludeFrom == "object") {
        featureIntegration = Object.assign(featureIntegration, propertyValue.propertyMetadata.excludeFrom);
      }
      if (typeof propertyValue.propertyMetadata.sublabel == "string") {
        sublabel = propertyValue.propertyMetadata.sublabel;
      }
    }
    jqCardView.first().prop("checked", !featureIntegration.cardView);
    jqAutoComplete.first().prop("checked", !featureIntegration.autoComplete);
    jqCalcCompare.first().prop("checked", !featureIntegration.calcCompare);
    jqDotNotation.first().prop("checked", !featureIntegration.dotNotation);
    jqSublabel.first().val(sublabel);
    jqFields = jqFields.slice(1);
    jqCardView = jqCardView.slice(1);
    jqAutoComplete = jqAutoComplete.slice(1);
    jqCalcCompare = jqCalcCompare.slice(1);
    jqDotNotation = jqDotNotation.slice(1);
    jqSublabel = jqSublabel.slice(1);
  }
}
/** Function for retrieving the contents of a selected cell and putting them in the form boxes. */
async function getData() {
  await Excel.run(async (context) => {
    const activeCell = context.workbook.getActiveCell();
    activeCell.load("valuesAsJson");
    await context.sync();
    const value = activeCell.valuesAsJson[0][0];
    clearForm();

    var valueType = value.type == "LinkedEntity" ? "Entity" : value.type;
    $("#dataTypeSelect").val(valueType);
    setSelectedType(getTypeContent(valueType));

    switch (value.type) {
      case "String":
        $("#basicValue").val(value.basicValue);
        break;
      case "Double":
        $("#basicValue").val(value.basicValue);
        break;
      case "Boolean":
        const basicValue = value.basicValue;
        if (basicValue) {
          $("#basicValue").val("true");
        } else {
          $("#basicValue").val("false");
        }
        break;
      case "WebImage":
        $("#url").val(value.address);
        $("#altText").val(value.altText);
        break;
      case "FormattedNumber":
        $("#format").val(value.numberFormat);
        $("#number").val(value.basicValue);
        break;
      case "Entity":
      case "LinkedEntity":
        getEntity(value);
        break;
    }
  });
}

/** Function for clearing the input boxes. */
async function clearForm() {
  $(".inputBox").val("");
  $(".cardView").prop("checked", true);
  $(".autoComplete").prop("checked", true);
  $(".calcCompare").prop("checked", true);
  $(".dotNotation").prop("checked", true);
  $(".mainImage").prop("checked", false);
  $(".sublabel").val("");
  $(".specificFieldContents").remove();
  $(".sectionContents").remove();
  $("#iconSelect").val("Generic");

  setSelectedType(
    getTypeContent(
      $("#dataTypeSelect")
        .val()
        .toString()
    )
  );
}

/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    alert("Error in running script:\n\n" + error + ".");
    console.error(error);
  }
}
