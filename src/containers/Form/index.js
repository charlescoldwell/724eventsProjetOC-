import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      // We try to call mockContactApi
    const form = evt.target;
    const lastName = form.lastName?.value;
    const firstName = form.firstName?.value;
    const company = form.company?.value;
    const email = form.email?.value;
    const textArea = form.textArea?.value;
      if ( lastName && firstName && company && email && textArea ) {
      setSending(true);
        try {
          await mockContactApi();
          setSending(false);
          onSuccess();  // Modal fix
        } catch (err) {
          setSending(false);
          onError(err);
        }
      }
      else {
        onError();
      }
    },
    [onSuccess, onError]
  );
  
  return (
    <form onSubmit={sendContact} autoComplete="off" >
  <div className="row">
    <div className="col">
      <Field placeholder="" label="Nom" name='lastName' />
      <Field placeholder="" label="Prénom" name='firstName' />
      <Select
        selection={["Personel", "Entreprise"]}
        onChange={() => null}
        label="Personel / Entreprise"
        type="large"
        titleEmpty
        name='company'
      />
      <Field placeholder="" label="Email" name='email' autoComplete="off" />
      <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
        {sending ? "En cours" : "Envoyer"}
      </Button>
    </div>
    <div className="col">
      <Field
        placeholder="message"
        label="Message"
        type={FIELD_TYPES.TEXTAREA}
        name='textArea'
      />
    </div>
  </div>
</form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
