import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Store/AllReducers/userSlice";

const TopBar = ({ onSidebarToggle, isSidebarActive }) => {
	const { myUser } = useSelector((state) => state.currentUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div className={`bg-light shadow border top-bar`}>
			<div className="container-fluid">
				<div className="top-bar d-flex justify-content-between align-items-center">
					<Button
						id="sidebarCollapse"
						onClick={onSidebarToggle}
						className="btn admin-btn-primary rounded-1"
					>
						<i className="fa fa-bars" />
					</Button>
					<div className="user-settings">
						<Dropdown>
							<Dropdown.Toggle variant="primary" id="dropdown-basic">
								{myUser?.name || "User"}
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item
									href="#"
									onClick={() => dispatch(logout(navigate))}
								>
									<i className="fa fa-sign-out pe-2"></i> Logout
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TopBar;
