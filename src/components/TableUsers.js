import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import Image from "react-bootstrap/Image";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import ReactPaginate from "react-paginate";
import "./TableUsers.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import _, { debounce } from "lodash";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEditUser, setIsShowModalEditUser] = useState(false);
  const [isShowModalDeleteUser, setIsShowModalDeleteUser] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelete, setDataUserDelete] = useState({});
  const [sortBy, setSortBy] = useState("desc");
  const [sortField, setSortField] = useState("id");
  const [keyword, setKeyword] = useState("");
  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEditUser(false);
    setIsShowModalDeleteUser(false);
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
    setDataUserEdit(user);
    setIsShowModalEditUser(true);
  };

  const handleDeleteUser = (user) => {
    console.log("user: ", user);
    setIsShowModalDeleteUser(true);
    setDataUserDelete(user);
  };

  const handleEditUserFromModal = (user) => {
    // vì js mặc dù clone object nhưng nó vẫn lưu chung trong một vùng nhớ nên dùng thư viện lodash và component _.cloneDeep để lưu 2 vùng nhớ khác nhau.
    let cloneListUser = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;

    setListUsers(cloneListUser);
  };

  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    console.log("cloneListUser: ", cloneListUser);
    setListUsers(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    console.log("cloneListUser: ", cloneListUser);
    setListUsers(cloneListUser);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    console.log("event: ", event.target.value);

    if (term) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      setListUsers(cloneListUser);

      // cloneListUser = _.includes(cloneListUser, (item) => item.includes);
    } else {
      getUsers(1);
    }
  }, 500);

  // const csvData = [
  //   ["firstname", "lastname", "email"],
  //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
  //   ["Raed", "Labes", "rl@smthing.co.com"],
  //   ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  // ];

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "First Name", "Last Name"]);
      listUsers.map((item) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.warning("Only accept csv file...");
        return;
      }
      console.log("check file upload:", file);
      // Parse local CSV file
      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;

          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "Email" ||
                rawCSV[0][1] !== "First Name" ||
                rawCSV[0][2] !== "Last Name"
              ) {
                toast.warning("Wrong format header csv file!");
              } else {
                let result = [];

                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
                console.log("Finished:", result);
              }
            } else {
              toast.warning("Wrong format csv file!");
            }
          } else toast.warning("Not found data on csv file!");
        },
      });
    }
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b> List Users:</b>
        </span>
        <div className="group-btns">
          <label htmlFor="import" className="btn btn-warning text-white">
            <i className="fa-solid fa-file-import"></i>
            <span> Import</span>
          </label>
          <input
            id="import"
            type="file"
            hidden
            onChange={(event) => {
              handleImportCSV(event);
            }}
          />

          <CSVLink
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
            filename={"user.csv"}
            className="btn btn-primary mx-2">
            <i className="fa-solid fa-file-export"></i>
            <span> Download</span>
          </CSVLink>

          <button
            className="btn btn-success p"
            onClick={() => {
              setIsShowModalAddNew(true);
            }}>
            <i className="fa-solid fa-circle-plus "></i>
            <span> Add new</span>
          </button>
        </div>
      </div>
      <div className="col-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email..."
          // value={keyword}
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("desc", "id")}></i>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("asc", "id")}></i>
                </span>
              </div>
            </th>
            <th>Avatar</th>
            <th>Email</th>
            <th>
              <div className="sort-header">
                <span>First Name</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("desc", "first_name")}></i>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("asc", "first_name")}></i>
                </span>
              </div>
            </th>
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
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleDeleteUser(item);
                      }}>
                      Delete
                    </button>
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
      <ModalConfirm
        show={isShowModalDeleteUser}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};

export default TableUsers;
