import { computed, ref } from "vue";
export function useValidation() {
    const errors = ref({});

    const isValid = ref(true);

    function resetErrors() {
        isValid.value = true;
        errors.value = {};
    }

    function addError(path, message) {
        isValid.value = false;
        const segments = path.split(".");
        let target = errors.value;
        let i;
        for (i = 0; i < segments.length - 1; i++) {
            if (!target[segments[i]]) {
                target[segments[i]] = {};
            }
            target = target[segments[i]];
        }
        if (!target[segments[i]]) {
            target[segments[i]] = {};
        }
        if (!target[segments[i]].errors) {
            target[segments[i]].errors = [];
        }
        target[segments[i]].errors.push(message);
    }

    function getErrors(path) {
        const segments = path.split(".");
        let target = errors.value;
        let i;
        for (i = 0; i < segments.length; i++) {
            if (!target) {
                return [];
            }
            target = target[segments[i]] || [];
        }
        return target.errors ? target.errors : [];
    }

    return { isValid, getErrors, resetErrors, addError };
}
