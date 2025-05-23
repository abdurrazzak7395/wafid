$(function () {
    let requiredFields = [];
    try {
        requiredFields = REQUIRED_FIELDS;
    } catch (e) {
        console.log("REQUIRED_FIELDS undefined");
        return
    }

    let optionalFields = [];
    try {
        optionalFields = OPTIONAL_FIELDS;
    } catch (e) {
        console.log("OPTIONAL_FIELDS undefined");
    }

    function cleanErrors() {
        $(".field-error-message").remove();
        $(".field.error").removeClass("error");
    }

    function showFieldError(field_id, text) {
        const error = '<div class="field-error-message"><i class="times circle icon"></i>' + (text || 'This field is required.') + '</div>';

        const field = $("#id_" + field_id);
        if (field.prop("type") === "checkbox") {
            field.parent().find("label").after(error);
        } else if (field.prop("type") === "file") {
            field.parent().find(".ui.icon.input").after(error);
        } else if (field_id === "captcha_1") {
            field.parent().after(error);
        } else if (field.hasClass("phone")) {
            field.after(error);
        } else if (field.prop("type") === "email") {
            field.after(error);
        } else if (field.prop("type") === "url") {
            field.after(error);
        } else {
            field.after(error);
        }
        field.closest(".field").addClass("error");
    }

    function validateFile(field, exts, maxSize) {
        let success = true;

        if (!field.length) {
            return success
        }

        let file = field[0].files[0];

        let name = file.name;
        let ext = name.split('.')[name.split('.').length - 1].toLowerCase();
        let size = file.size;

        if (!exts.includes(ext) || size > maxSize) {
            success = false
        }

        return success;
    }

    const exts = [
            "gif",
            "jpeg",
            "jpg",
            "bmp",
            "png",
            "jpg",
            "pdf",
            "doc",
            "docx"
        ]
    const maxSize = 1024 * 1024 * 10;

    function validateFields(fields, optional = false) {
        let success = true;
        for (let field_id of fields) {
            let field = $("#id_" + field_id);

            if (optional && !field.val()) {
                continue;
            }

            if (field.length && field.prop("type") === "file") {
                try {
                    if (!field.val() && !$("[name=" + field_id + "_text]").prop("placeholder")) {
                        showFieldError(field_id);
                        success = false;
                    } else if (!validateFile(field, exts, maxSize)) {
                        showFieldError(field_id,  "Max size: 10Mb. Allowed types: " + exts.join(', '));
                    }                        
                } catch (e) {
                    console.log(e);
                }
            } else if (field.length && field.prop("type") === "url" && !field.val().trim().match(/^(ftp|http|https):\/\/[^ "]+$/i)) {
                showFieldError(field_id, "Enter valid URL");
                success = false;
            } else if (field.length && (!field.val() || (field.prop("type") === "checkbox" && !field.prop("checked")))) {
                showFieldError(field_id);
                success = false;
            } else if (field.hasClass("phone") && !field.val().trim().match(/^\+\d{9,13}$/i)) {
                showFieldError(field_id, "Number must be entered in the format: +XXXXXXXXXXXXX. Up to 14 digits allowed.");
                success = false;
            } else if (field.prop("type") === "email" && !field.val().trim().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                showFieldError(field_id, "Enter valid Email");
                success = false;
            }
        }
        return success;
    }

    $(".content-container form").on("submit", function (e) {
        cleanErrors();
        if (!validateFields(requiredFields)) {
            e.preventDefault();
        }
        if (!validateFields(optionalFields, true)) {
            e.preventDefault();
        }
    })

    const $phones = $("input.phone");
    $phones.inputmask("+9999999999999", {"placeholder": " "});

});
