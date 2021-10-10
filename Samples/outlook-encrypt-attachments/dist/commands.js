!function(e){var t={};function n(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,n),c.l=!0,c.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)n.d(o,c,function(t){return e[t]}.bind(null,c));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=386)}({386:function(e,t){var n;function o(e){if(console.log("onItemAttachmentsChangedHandler: "+e.attachmentDetails.name+" ("+e.attachmentStatus+")"),e.attachmentDetails.name!="".concat("decrypted_").concat(n)){if(void 0!==n)return console.log("Skipping processing of further attachments - demo is done!"),void e.completed();n=e.attachmentDetails.name;var t=Office.context.mailbox.item,o={asyncContext:{currentItem:t}};t.getAttachmentsAsync(o,c)}else e.completed()}function c(e){if(e.value.length>0)for(i=0;i<e.value.length;i++)e.asyncContext.currentItem.getAttachmentContentAsync(e.value[i].id,a)}function a(e){switch(console.log("handleAttachmentsCallback(): result.value.format = ".concat(e.value.format)),e.value.format){case Office.MailboxEnums.AttachmentContentFormat.Base64:var t={asyncContext:{base64:e.value.content}};Office.context.mailbox.item.notificationMessages.addAsync("processingAttachments",{type:Office.MailboxEnums.ItemNotificationMessageType.ProgressIndicator,message:"Please wait while the '".concat(n,"' attachment is encrypted...")},t,(function(e){if(e.status===Office.AsyncResultStatus.Succeeded)try{var t=CryptoJS.AES.encrypt(e.asyncContext.base64,"secret key 123").toString();console.log("handleAttachmentsCallback(): starting processing of file '".concat(n,"'...")),function(e){console.log("encryptAttachment(): Encrypting file '".concat(n,"''..."));var t=window.btoa(e),o="".concat("encrypted_").concat(n);console.log("encryptAttachment(): Adding encrypted file '".concat(o,"'...")),Office.context.mailbox.item.addFileAttachmentFromBase64Async(t,o,(function(t){console.log("encryptAttachment(): Added encrypted attachment '".concat(o,"'; now decrypting...")),function(e){console.log("decryptAttachment(): Decrypting file '".concat(n,"''..."));var t=CryptoJS.AES.decrypt(e,"secret key 123").toString(CryptoJS.enc.Utf8),o="".concat("decrypted_").concat(n);console.log("decryptAttachment(): Adding decrypted file '".concat(o,"'...")),Office.context.mailbox.item.addFileAttachmentFromBase64Async(t,o,(function(e){console.log("decryptAttachment(): Added decrypted attachment '".concat(o,"'")),Office.context.mailbox.item.notificationMessages.removeAsync("processingAttachments",(function(e){console.log("Notification message removed."),Office.context.mailbox.item.notificationMessages.addAsync("attachmentsAdded",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:"The '".concat(n,"' attachment has been encrypted and decrypted and added as reference attachments for your review."),icon:"Icon.16x16",persistent:!1})}))}))}(e)}))}(t)}catch(e){console.error("handleAttachmentsCallback(): Error: ".concat(e)),Office.context.mailbox.item.notificationMessages.removeAsync("processingAttachments",(function(e){console.log("Notification message removed.")}))}else console.error("handleAttachmentsCallback(): Unexpected - status is ".concat(e.status))}));break;case Office.MailboxEnums.AttachmentContentFormat.Eml:console.log("Attachment is a message.");break;case Office.MailboxEnums.AttachmentContentFormat.ICalendar:console.log("Attachment is a calendar item.");break;case Office.MailboxEnums.AttachmentContentFormat.Url:console.log("Attachment is a cloud attachment.");break;default:console.log("Not handling unsupported attachment.")}}Office.initialize=function(e){},Office.actions.associate("onMessageComposeHandler",(function(){Office.context.mailbox.item.notificationMessages.addAsync("showInfoBarForSampleInstructions",{type:Office.MailboxEnums.ItemNotificationMessageType.InsightMessage,message:"Open the Task Pane for details about running the Outlook Event-based Activation Sample Add-in",icon:"Icon.16x16",actions:[{actionText:"Show Task Pane",actionType:Office.MailboxEnums.ActionType.ShowTaskPane,commandId:"msgComposeOpenPaneButton",contextData:"{''}"}]})})),Office.actions.associate("onAppointmentComposeHandler",(function(e){console.log("onAppointmentComposeHandler(): entered!");var t={};Office.context.mailbox.item.start.getAsync((function(n){if(n.status!==Office.AsyncResultStatus.Succeeded)return console.error("Action failed with message ".concat(n.error.message)),void n.asyncContext.completed();console.log("Appointment starts: ".concat(n.value)),t.start=n.value,Office.context.mailbox.item.end.getAsync((function(n){if(n.status!==Office.AsyncResultStatus.Succeeded)return console.error("Action failed with message ".concat(n.error.message)),void n.asyncContext.completed();console.log("Appointment ends: ".concat(n.value)),t.end=n.value,localStorage.setItem("appointment_info",JSON.stringify(t)),Office.context.mailbox.item.notificationMessages.addAsync("showInfoBarForSampleInstructions",{type:Office.MailboxEnums.ItemNotificationMessageType.InsightMessage,message:"Open the Task Pane for details about running the Outlook Event-based Activation Sample Add-in",icon:"Icon.16x16",actions:[{actionText:"Show Task Pane",actionType:Office.MailboxEnums.ActionType.ShowTaskPane,commandId:"appOrgTaskPaneButton",contextData:"{''}"}]},(function(t){e.completed()}))}))}))})),Office.actions.associate("onMessageAttachmentsChangedHandler",o),Office.actions.associate("onAppointmentAttachmentsChangedHandler",o),Office.actions.associate("onAppointmentAttendeesChangedHandler",(function(e){var t=0,n=0,o=0;console.log("onAppointmentAttendeesChangedHandler() type = ".concat(e.type,"; changedRecipientFields = ").concat(e.changedRecipientFields)),Office.context.mailbox.item.requiredAttendees.getAsync((function(c){if(c.status===Office.AsyncResultStatus.Succeeded){var a=c.value;n=a.length,console.log("totalRequiredAttendees = ".concat(n)),currentDistributionLists=a.filter((function(e){return"distributionList"===e.recipientType})),0!==currentDistributionLists.length&&(o+=currentDistributionLists.length),Office.context.mailbox.item.optionalAttendees.getAsync((function(c){if(console.log("status = ".concat(c.status)),c.status===Office.AsyncResultStatus.Succeeded){var a=c.value;t=a.length,currentDistributionLists=a.filter((function(e){return"distributionList"===e.recipientType})),0!==currentDistributionLists.length&&(o+=currentDistributionLists.length)}else console.error("Error with item.optionalAttendees.getAsync(): ".concat(c.error));console.log("totalDistributionLists = ".concat(o)),0===t&&0===n?Office.context.mailbox.item.notificationMessages.removeAsync("attendeesChanged",null,(function(t){t.status===Office.AsyncResultStatus.Succeeded?(console.log("asyncResult3.status = ".concat(t.status)),Office.context.mailbox.item.notificationMessages.removeAsync("distributionListWarning",null,(function(t){t.status===Office.AsyncResultStatus.Succeeded?(console.log("asyncResultDLs.status = ".concat(t.status)),e.completed()):(console.error("Error with item.notificationMessages.removeAsync(): ".concat(t.error)),e.completed())}))):(console.error("Error with item.notificationMessages.removeAsync(): ".concat(t.error)),e.completed())})):Office.context.mailbox.item.notificationMessages.replaceAsync("attendeesChanged",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:"Your appointment has ".concat(n," required and ").concat(t," optional attendees"),icon:"Icon.16x16",persistent:!1},(function(t){if(t.status===Office.AsyncResultStatus.Succeeded){var n=!1;Office.context.mailbox.item.notificationMessages.getAllAsync((function(t){var c;(console.log("getAllAsync(): asyncResult5.status = ".concat(t.status)),t.status===Office.AsyncResultStatus.Succeeded)?0!==t.value.filter((function(e){return"distributionListWarning"===e.key})).length&&(n=!0):console.error("Error with item.notificationMessages.getAllAsync(): ".concat(t.error));(0===o&&!0===n&&Office.context.mailbox.item.notificationMessages.removeAsync("distributionListWarning",null,(function(t){t.status!==Office.AsyncResultStatus.Succeeded?console.error("Error with item.notificationMessages.removeAsync(): ".concat(t.error)):e.completed()})),0!==o)?(c=1===o?"Warning! Your appointment has a distribution list! Make sure you have chosen the correct one!":"Warning! Your appointment has ".concat(o," distribution lists! Make sure you have chosen the correct one!"),Office.context.mailbox.item.notificationMessages.replaceAsync("distributionListWarning",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:c,icon:"Icon.16x16",persistent:!1},(function(){console.log("done"),e.completed()}))):e.completed()}))}else console.error("Error with item.notificationMessages.replaceAsync(): ".concat(t.error))}))}))}else console.error("Unexpected: asyncResult.status = ".concat(c.status)),c.completed()}))})),Office.actions.associate("onAppointmentTimeChangedHandler",(function(e){console.dir(e),console.dir(e.type),console.dir(e.start),console.dir(e.end);var t=JSON.parse(localStorage.getItem("appointment_info")),n=new Date(t.start),o=new Date(t.end),c=Office.context.mailbox.convertToLocalClientTime(n),a=Office.context.mailbox.convertToLocalClientTime(o),i=new Date(c.year,c.month,c.date,c.hours,c.minutes),s=new Date(a.year,a.month,a.date,a.hours,a.minutes);Office.context.mailbox.item.notificationMessages.getAllAsync((function(t){if(console.log("getAllAsync(): asyncResult.status = ".concat(t.status)),"failed"!=t.status)for(var n=0;n<t.value.length;n++){if("timeChanged"===t.value[n].key)return void e.completed}var o="Original date/time: Start = ".concat(i.toLocaleDateString()," ").concat(i.toLocaleTimeString(),"; End = ").concat(s.toLocaleDateString()," ").concat(s.toLocaleTimeString());Office.context.mailbox.item.notificationMessages.replaceAsync("timeChanged",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:o,icon:"Icon.16x16",persistent:!1},(function(t){console.log("replaceAsync() for 'timeChanged' completed"),console.dir(t),dateStampMessageSet=!0,e.completed()}))}))}))}});
//# sourceMappingURL=commands.js.map