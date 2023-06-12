import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteUser } from "../services/UserService";

const ModalConfirm = (props) => {
  const { show, handleClose, handleDeleteUserFromModal, dataUserDelete } =
    props;
  const confirmDelete = async () => {
    let res = await deleteUser(dataUserDelete.id);
    if (res && +res.statusCode === 204) {
      handleDeleteUserFromModal(dataUserDelete);
      toast.success("Delete user success!");
      handleClose();
    } else {
      toast.error("Error delete user");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            This action can't be undone! Dow you want to delete this user?{" "}
            <br />
            <b> email: {dataUserDelete.email}</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfirm;
