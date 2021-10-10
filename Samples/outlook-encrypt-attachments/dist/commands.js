!function(e){var t={};function n(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=386)}({386:function(e,t){var n;function o(e){if(console.log("onItemAttachmentsChangedHandler: "+e.attachmentDetails.name+" ("+e.attachmentStatus+")"),e.attachmentDetails.name!="decrypted_".concat(n)){if(void 0!==n)return console.log("Skipping processing of further attachments - demo is done!"),void e.completed();n=e.attachmentDetails.name;var t=Office.context.mailbox.item,o={asyncContext:{currentItem:t}};t.getAttachmentsAsync(o,a)}else e.completed()}function a(e){if(e.value.length>0)for(i=0;i<e.value.length;i++)e.asyncContext.currentItem.getAttachmentContentAsync(e.value[i].id,c)}function c(e){switch(console.log("handleAttachmentsCallback(): result.value.format = ".concat(e.value.format)),e.value.format){case Office.MailboxEnums.AttachmentContentFormat.Base64:Office.context.mailbox.item.notificationMessages.addAsync("processingAttachments",{type:Office.MailboxEnums.ItemNotificationMessageType.ProgressIndicator,message:"Please wait while the '".concat(n,"' attachment is encrypted...")}),function(e){console.log("addEncryptedAttachmentForCryptoJs(): encrypted data:");var t=window.btoa(e);console.log("addEncryptedAttachmentForCryptoJs(): base64 encrypted data:"),Office.context.mailbox.item.addFileAttachmentFromBase64Async(t,"encrypted_"+n,(function(t){console.log("addEncryptedAttachmentForCryptoJs(): Added encrypted attachment 'encrypted_"+n),console.dir(t),function(e){var t=CryptoJS.AES.decrypt(e,"secret key 123").toString(CryptoJS.enc.Utf8);console.log("decryptAttachmentForCryptoJs(): Original base64: ".concat(t)),Office.context.mailbox.item.addFileAttachmentFromBase64Async(t,"decrypted_"+n,(function(e){console.log("Added decrypted attachment 'decrypted_"+n),Office.context.mailbox.item.notificationMessages.removeAsync("processingAttachments",(function(e){console.log("Notification message removed."),Office.context.mailbox.item.notificationMessages.addAsync("attachmentsAdded",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:"The '".concat(n,"' attachment has been encrypted and decrypted and added as reference attachments for your review."),icon:"Icon.16x16",persistent:!1})}))}))}(e)}))}(CryptoJS.AES.encrypt(e.value.content,"secret key 123").toString());break;case Office.MailboxEnums.AttachmentContentFormat.Eml:console.log("Attachment is a message.");break;case Office.MailboxEnums.AttachmentContentFormat.ICalendar:console.log("Attachment is a calendar item.");break;case Office.MailboxEnums.AttachmentContentFormat.Url:console.log("Attachment is a cloud attachment.")}}Office.initialize=function(e){},Office.actions.associate("onMessageComposeHandler",(function(){Office.context.mailbox.item.notificationMessages.addAsync("showInfoBarForSampleInstructions",{type:Office.MailboxEnums.ItemNotificationMessageType.InsightMessage,message:"Open the Task Pane for details about running the Outlook Event-based Activation Sample Add-in",icon:"Icon.16x16",actions:[{actionText:"Show Task Pane",actionType:Office.MailboxEnums.ActionType.ShowTaskPane,commandId:"msgComposeOpenPaneButton",contextData:"{''}"}]})})),Office.actions.associate("onAppointmentComposeHandler",(function(e){console.log("onAppointmentComposeHandler(): entered!");var t={};Office.context.mailbox.item.start.getAsync((function(n){if(n.status!==Office.AsyncResultStatus.Succeeded)return console.error("Action failed with message ".concat(n.error.message)),void n.asyncContext.completed();console.log("Appointment starts: ".concat(n.value)),t.start=n.value,Office.context.mailbox.item.end.getAsync((function(n){if(n.status!==Office.AsyncResultStatus.Succeeded)return console.error("Action failed with message ".concat(n.error.message)),void n.asyncContext.completed();console.log("Appointment ends: ".concat(n.value)),t.end=n.value,localStorage.setItem("appointment_info",JSON.stringify(t)),Office.context.mailbox.item.notificationMessages.addAsync("showInfoBarForSampleInstructions",{type:Office.MailboxEnums.ItemNotificationMessageType.InsightMessage,message:"Open the Task Pane for details about running the Outlook Event-based Activation Sample Add-in",icon:"Icon.16x16",actions:[{actionText:"Show Task Pane",actionType:Office.MailboxEnums.ActionType.ShowTaskPane,commandId:"appOrgTaskPaneButton",contextData:"{''}"}]},(function(t){e.completed()}))}))}))})),Office.actions.associate("onMessageAttachmentsChangedHandler",o),Office.actions.associate("onAppointmentAttachmentsChangedHandler",o),Office.actions.associate("onAppointmentAttendeesChangedHandler",(function(e){var t=0,n=0,o=0;console.log("onAppointmentAttendeesChangedHandler() type = ".concat(e.type,"; changedRecipientFields = ").concat(e.changedRecipientFields)),Office.context.mailbox.item.requiredAttendees.getAsync((function(a){if(a.status===Office.AsyncResultStatus.Succeeded){var i=a.value;n=i.length,console.log("totalRequiredAttendees = ".concat(n)),currentDistributionLists=i.filter((function(e){return"distributionList"===e.recipientType})),0!==currentDistributionLists.length&&(o+=currentDistributionLists.length),Office.context.mailbox.item.optionalAttendees.getAsync((function(a){if(console.log("status = ".concat(a.status)),a.status===Office.AsyncResultStatus.Succeeded){var i=a.value;t=i.length,currentDistributionLists=i.filter((function(e){return"distributionList"===e.recipientType})),0!==currentDistributionLists.length&&(o+=currentDistributionLists.length)}else console.error("Error with item.optionalAttendees.getAsync(): ".concat(a.error));console.log("totalDistributionLists = ".concat(o)),0===t&&0===n?Office.context.mailbox.item.notificationMessages.removeAsync("attendeesChanged",null,(function(t){t.status===Office.AsyncResultStatus.Succeeded?(console.log("asyncResult3.status = ".concat(t.status)),Office.context.mailbox.item.notificationMessages.removeAsync("distributionListWarning",null,(function(t){t.status===Office.AsyncResultStatus.Succeeded?(console.log("asyncResultDLs.status = ".concat(t.status)),e.completed()):(console.error("Error with item.notificationMessages.removeAsync(): ".concat(t.error)),e.completed())}))):(console.error("Error with item.notificationMessages.removeAsync(): ".concat(t.error)),e.completed())})):Office.context.mailbox.item.notificationMessages.replaceAsync("attendeesChanged",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:"Your appointment has ".concat(n," required and ").concat(t," optional attendees"),icon:"Icon.16x16",persistent:!1},(function(t){if(t.status===Office.AsyncResultStatus.Succeeded){var n=!1;Office.context.mailbox.item.notificationMessages.getAllAsync((function(t){var a;(console.log("getAllAsync(): asyncResult5.status = ".concat(t.status)),t.status===Office.AsyncResultStatus.Succeeded)?0!==t.value.filter((function(e){return"distributionListWarning"===e.key})).length&&(n=!0):console.error("Error with item.notificationMessages.getAllAsync(): ".concat(t.error));(0===o&&!0===n&&Office.context.mailbox.item.notificationMessages.removeAsync("distributionListWarning",null,(function(t){t.status!==Office.AsyncResultStatus.Succeeded?console.error("Error with item.notificationMessages.removeAsync(): ".concat(t.error)):e.completed()})),0!==o)?(a=1===o?"Warning! Your appointment has a distribution list! Make sure you have chosen the correct one!":"Warning! Your appointment has ".concat(o," distribution lists! Make sure you have chosen the correct one!"),Office.context.mailbox.item.notificationMessages.replaceAsync("distributionListWarning",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:a,icon:"Icon.16x16",persistent:!1},(function(){console.log("done"),e.completed()}))):e.completed()}))}else console.error("Error with item.notificationMessages.replaceAsync(): ".concat(t.error))}))}))}else console.error("Unexpected: asyncResult.status = ".concat(a.status)),a.completed()}))})),Office.actions.associate("onAppointmentTimeChangedHandler",(function(e){console.dir(e),console.dir(e.type),console.dir(e.start),console.dir(e.end);var t=JSON.parse(localStorage.getItem("appointment_info")),n=new Date(t.start),o=new Date(t.end),a=Office.context.mailbox.convertToLocalClientTime(n),i=Office.context.mailbox.convertToLocalClientTime(o),c=new Date(a.year,a.month,a.date,a.hours,a.minutes),s=new Date(i.year,i.month,i.date,i.hours,i.minutes);Office.context.mailbox.item.notificationMessages.getAllAsync((function(t){if(console.log("getAllAsync(): asyncResult.status = ".concat(t.status)),"failed"!=t.status)for(var n=0;n<t.value.length;n++){if("timeChanged"===t.value[n].key)return void e.completed}var o="Original date/time: Start = ".concat(c.toLocaleDateString()," ").concat(c.toLocaleTimeString(),"; End = ").concat(s.toLocaleDateString()," ").concat(s.toLocaleTimeString());Office.context.mailbox.item.notificationMessages.replaceAsync("timeChanged",{type:Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,message:o,icon:"Icon.16x16",persistent:!1},(function(t){console.log("replaceAsync() for 'timeChanged' completed"),console.dir(t),dateStampMessageSet=!0,e.completed()}))}))}))}});
//# sourceMappingURL=commands.js.map