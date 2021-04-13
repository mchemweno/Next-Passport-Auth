import {useRouter} from 'next/router'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import toast, {Toaster} from 'react-hot-toast';

const ResetPassword = (props) => {
    const router = useRouter();
    const {token} = router.query;

    const initialValues = {
        password: '',
        rePassword: '',
    };

    const validationSchema = Yup.object({
        password: Yup.string().required().min(6),
        rePassword: Yup.string().required().min(6)
    });

    const handlerSubmit = async (values, submitProps) => {
        try {

            const {password} = values;
            const {rePassword} = values;

            const credentials = {
                password,
                rePassword
            }

            const response = await fetch(`http://127.0.0.1:3000/api/auth/resetPassword`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(credentials),
            });
            const resData = await response.json();
            console.log(resData);

            if (response.status !== 200) {
                throw new Error(resData.message);
            }

            console.log('Form data', values);
            console.log('submitProps', submitProps);
            submitProps.resetForm();
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.success(resData.message);

        } catch (e) {
            console.log(e.message);
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.error('something went wrong.');
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlerSubmit}>
            {/* The name attribute is used to hook up with the formik state */}
            {({isValid, isSubmitting, values, touched}) => (
                <Form>
                    <div>
                        <label htmlFor="password">
                            Password
                        </label>
                        <Field
                            as="input"
                            type="password"
                            id="password"
                            name="password"
                            required
                            autoComplete="off"
                        />
                        <ErrorMessage
                            name="password"
                        />
                    </div>
                    <div>
                        <label htmlFor="rePassword">
                            Re_Password
                        </label>
                        <Field
                            as="input"
                            type="password"
                            id="rePassword"
                            name="rePassword"
                            required
                            autoComplete="off"
                        />
                        <ErrorMessage
                            name="rePassword"
                        />
                    </div>
                    {values.password !== values.rePassword && touched.rePassword ?
                        <p>Passwords do not match!</p> : null}
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting || values.password !== values.rePassword}>
                        Send Message
                    </button>
                </Form>)}
        </Formik>
    )
}

export default ResetPassword;
