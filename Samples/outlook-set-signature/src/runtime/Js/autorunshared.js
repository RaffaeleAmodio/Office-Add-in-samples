// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Contains code for event-based activation on both Outlook on web and Windows.

/**
 * Checks if signature exists.
 * If not, displays the information bar for user.
 * If exists, insert signature into new item (appointment or message).
 * @param {*} eventObj Office event object
 * @returns
 */
 function checkSignature(eventObj) {
  let user_info_str = Office.context.roamingSettings.get("user_info");
  if (!user_info_str) {
    display_insight_infobar();
  } else {
    let user_info = JSON.parse(user_info_str);

    if (Office.context.mailbox.item.getComposeTypeAsync) {
      Office.context.mailbox.item.getComposeTypeAsync(
        {
          asyncContext: {
            user_info: user_info,
            eventObj: eventObj,
          },
        },
        function (asyncResult) {
          if (asyncResult.status === "succeeded") {
            insert_auto_signature(
              asyncResult.value.composeType,
              asyncResult.asyncContext.user_info,
              asyncResult.asyncContext.eventObj
            );
          }
        }
      );
    } else {
      // Appointment item. Just use newMail pattern
      let user_info = JSON.parse(user_info_str);
      insert_auto_signature("newMail", user_info, eventObj);
    }
  }
}

/**
 * Gets template name (A,B,C) mapped based on the compose type
 * @param {*} compose_type The compose type (reply, forward, newMail)
 * @returns Name of the template to use for the compose type
 */
function get_template_name(compose_type) {
  if (compose_type === "reply") return Office.context.roamingSettings.get("reply");
  if (compose_type === "forward") return Office.context.roamingSettings.get("forward");
  return Office.context.roamingSettings.get("newMail");
}

/**
 * Gets HTML signature in requested template format for given user
 * @param {\} template_name Which template format to use (A,B,C)
 * @param {*} user_info Information details about the user
 * @returns HTML signature in requested template format
 */
function get_signature_str(template_name, user_info) {
  if (template_name === "templateB") return get_template_B_str(user_info);
  if (template_name === "templateC") return get_template_C_str(user_info);
  return get_template_A_str(user_info);
}


/**
 *
 * @returns Gets correct command id to match to item type (appointment or message)
 */
function get_command_id() {
  if (Office.context.mailbox.item.itemType == "appointment") {
    return "MRCS_TpBtn1";
  }
  return "MRCS_TpBtn0";
}

/**
 * Creates information bar to display when new message or appointment is created
 */
function display_insight_infobar() {
  Office.context.mailbox.item.notificationMessages.addAsync(
    "fd90eb33431b46f58a68720c36154b4a",
    {
      type: "insightMessage",
      message: "Please set your signature with the PnP sample add-in.",
      icon: "Icon.16x16",
      actions: [
        {
          actionType: "showTaskPane",
          actionText: "Set signatures",
          commandId: get_command_id(),
          contextData: "{''}",
        },
      ],
    },
    function (asyncResult) {
      // console.log("display_insight_infobar - " + JSON.stringify(asyncResult));
    }
  );
}

/**
 *
 * @param {*} user_info Information details about the user
 * @returns HTML signature in template A format
 */
function get_template_A_str(user_info) {
  let str = "";
  if (is_valid_data(user_info.greeting)) {
    str += user_info.greeting + "<br/>";
  }

  str += "<table>";
  str += "<tr>";
  str +=
    "<td style='border-right: 1px solid #000000; padding-right: 5px;'><img src='https://localhost:3000/assets/sample-logo.png' alt='Logo' /></td>";
  str += "<td style='padding-left: 5px;'>";
  str += "<strong>" + user_info.name + "</strong>";
  str += is_valid_data(user_info.pronoun) ? "&nbsp;" + user_info.pronoun : "";
  str += "<br/>";
  str += is_valid_data(user_info.job) ? user_info.job + "<br/>" : "";
  str += user_info.email + "<br/>";
  str += is_valid_data(user_info.phone) ? user_info.phone + "<br/>" : "";
  str += "</td>";
  str += "</tr>";
  str += "</table>";

  return str;
}

/**
 *
 * @param {*} user_info Information details about the user
 * @returns HTML signature in template B format
 */
function get_template_B_str(user_info) {
  let str = "";
  if (is_valid_data(user_info.greeting)) {
    str += user_info.greeting + "<br/>";
  }

  str += "<table>";
  str += "<tr>";
  str +=
    "<td style='border-right: 1px solid #000000; padding-right: 5px;'><img src='https://localhost:3000/assets/sample-logo.png' alt='Logo' /></td>";
  str += "<td style='padding-left: 5px;'>";
  str += "<strong>" + user_info.name + "</strong>";
  str += is_valid_data(user_info.pronoun) ? "&nbsp;" + user_info.pronoun : "";
  str += "<br/>";
  str += user_info.email + "<br/>";
  str += is_valid_data(user_info.phone) ? user_info.phone + "<br/>" : "";
  str += "</td>";
  str += "</tr>";
  str += "</table>";

  return str;
}

/**
 *
 * @param {*} user_info Information details about the user
 * @returns HTML signature in template C format
 */
function get_template_C_str(user_info) {
  let str = "";
  if (is_valid_data(user_info.greeting)) {
    str += user_info.greeting + "<br/>";
  }

  str += user_info.name;

  return str;
}

/**
 * Validates if str parameter contains text.
 * @param {*} str String to validate
 * @returns true if string is valid; otherise, false.
 */
function is_valid_data(str) {
  return str !== null && str !== undefined && str !== "";
}

/**
 * Set signature for current message.
 * @param {*} signature_str Signature to set
 * @param {*} eventObj Office event object
 */
function set_signature(signature_str, eventObj) {
  Office.context.mailbox.item.body.setSignatureAsync(
    signature_str,
    {
      coercionType: "html",
      asyncContext: eventObj,
    },
    function (asyncResult) {
      asyncResult.asyncContext.completed();
    }
  );
}

function getPlatformType() {
  try {
    if (Office.context.platform === "OfficeOnline") {
      return "OfficeOnline";
    } else {
      return "Unknown"; // This condition could occur if running on another platform outside of web or Windows.
    }
  } catch (error) {
    // Office.context.platform is not reachable on Windows and will throw an error.
    return "Windows";
  }
}

/**
 * Insert signature into appointment or message.
 * @param {*} compose_type The compose type (reply, forward, newMail)
 * @param {*} user_info Information details about the user
 * @param {*} eventObj Office event object
 */
function insert_auto_signature(compose_type, user_info, eventObj) {
  console.log("Inserting auto signature");
  let template_name = get_template_name(compose_type);
  let signature_str = get_signature_str(template_name, user_info);
  if (Office.context.mailbox.item.itemType == "appointment" && getPlatformType() === "OfficeOnline") {
    set_body(signature_str, eventObj);
  } else {
    set_signature(signature_str, eventObj);
  }
}

if (Office.actions) {
  Office.actions.associate("checkSignature", checkSignature);
}
