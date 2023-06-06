import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import Image from "react-bootstrap/Image";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import ReactPaginate from "react-paginate";
import _ from "lodash";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEditUser, setIsShowModalEditUser] = useState(false);
  const [dataUserEdit, setIsDataUserEdit] = useState({});

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEditUser(false);
  };

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
      setListUsers(res.data);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUser = (user) => {
    setIsDataUserEdit(user);
    setIsShowModalEditUser(true);
  };

  const handleEditUserFromModal = (user) => {
    // vì js mặc dù clone object nhưng nó vẫn lưu chung trong một vùng nhớ nên dùng thư viện lodash và component _.cloneDeep để lưu 2 vùng nhớ khác nhau.
    let cloneListUser = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;

    setListUsers(cloneListUser);
  };

  return (
    <>
      <div className="my-3 add-new">
        <span> List Users:</span>
        <button
          className="btn btn-success"
          onClick={() => {
            setIsShowModalAddNew(true);
          }}>
          Add new user
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <Image
                      src={item.avatar}
                      roundedCircle
                      style={{ height: 50, width: 50 }}
                    />
                  </td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-3"
                      onClick={() => handleEditUser(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-name"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />
      <ModalEditUser
        show={isShowModalEditUser}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleEditUserFromModal={handleEditUserFromModal}
      />
    </>
  );
};

export default TableUsers;
