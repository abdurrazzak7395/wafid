$(document).ready(function() {
    // Cache jQuery selectors to optimize DOM access
    const $orgCCRDiv = $("input[name='org_ccr_number']").closest(".field");
    const $orgCCRDateDiv = $("input[name='org_ccr_number_registration_date']").closest(".field");
    const $authorizedPersonIssueDiv = $("input[name='authorized_person_passport_issue_date']").closest(".field");
    const $authorizedPersonExpiryDiv = $("input[name='authorized_person_passport_expiry_date']").closest(".field");

    // Function to toggle visibility based on radio button value
    function toggleFields(value) {
        if (value === "individual") {
            $orgCCRDiv.hide();
            $orgCCRDateDiv.hide();
            $authorizedPersonIssueDiv.show();
            $authorizedPersonExpiryDiv.show();
        } else if (value === "organization") {
            $orgCCRDiv.show();
            $orgCCRDateDiv.show();
            $authorizedPersonIssueDiv.hide();
            $authorizedPersonExpiryDiv.hide();
        } else {
            $orgCCRDiv.hide();
            $orgCCRDateDiv.hide();
            $authorizedPersonIssueDiv.hide();
            $authorizedPersonExpiryDiv.hide();
        }
    }

    // Event listener for radio button changes
    $("input[type='radio'][name='authorized_body_type']").change(function() {
        toggleFields(this.value);
    });

    // Initialize fields based on the current value of the radio buttons
    var currentRadioValue = $("input[type='radio'][name='authorized_body_type']:checked").val();
    toggleFields(currentRadioValue);
});
