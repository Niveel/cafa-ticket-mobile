import { useFormikContext } from 'formik';
import { AppButton } from "@/components";

type Props = {
    title: string;
    forceEnable?: boolean;
};

const SubmitButton = ({ title, forceEnable = false }: Props) => {
    const { handleSubmit, isValid, dirty, isSubmitting } = useFormikContext();

    const isDisabled = !(isValid && (dirty || forceEnable)) || isSubmitting;

    return (
        <AppButton
            title={isSubmitting ? 'Submitting...' : title}
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isDisabled}
            onClick={() => {
                if (!isDisabled) {
                    handleSubmit();
                }
            }}
        />
    );
}

export default SubmitButton;