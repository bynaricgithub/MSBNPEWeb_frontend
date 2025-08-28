import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sidebarList } from "../../layout/Sidebar";


const AdminHome = () => {
	const [openMenus, setOpenMenus] = useState({});
	const navigate = useNavigate();

	const toggleMenu = (menu) => {
		setOpenMenus((prevState) => ({
			...prevState,
			[menu]: !prevState[menu],
		}));
	};

	const renderMenu = (menu, path) => {
		if (Array.isArray(menu)) {
			return menu.map((item, index) => (
				<div
					key={index}
					className="col-lg-4 p-2"
					role="button"
					onClick={() => navigate("/admin" + item.pathname)}
				>
					<div className="d-flex align-items-center rounded-3 shadow bg-white p-3 border">
						<i className={`pe-2 fa ${item.icon}`}></i>
						{item.name}
					</div>
				</div>
			));
		}

		return (
			<div
				key={path}
				className="col-lg-12 p-2"
				role="button"
				onClick={() => navigate("/admin" + menu.path)}
			>
				<div className="d-flex align-items-center rounded-3 shadow bg-white p-3">
					<i className={`pe-2 fa ${menu.icon}`}></i>
					{path}
				</div>
			</div>
		);
	};

	return (
		<div className="container-fluid fade-in-top my-4">
			<div className="card shadow">
				<div className="card-header">
					<h2 className="text-center mt-3">Welcome to admin</h2>
				</div>
				<div className="card-body p-4">
					<div className="row">
						{Object.keys(sidebarList).map((key) => (
							<div key={key} className="col-lg-12 p-2">
								{!Array.isArray(sidebarList[key]) ? (
									<div
										className="d-flex align-items-center rounded-3 shadow bg-white p-3 border"
										role="button"
										onClick={() => navigate("/admin" + sidebarList[key].path)}
									>
										<i className={`pe-2 fa ${sidebarList[key].icon}`}></i>
										{key}
									</div>
								) : (
									<>
										<div
											className="d-flex align-items-center rounded-3 shadow bgTheme text-white p-3"
											role="button"
											onClick={() => toggleMenu(key)}
										>
											<div className="d-flex align-items-center w-100">
												{openMenus[key] ? (
													<i className="fa fa-caret-down mx-2"></i>
												) : (
													<i className="fa fa-caret-right mx-2"></i>
												)}
												<div>{key}</div>
											</div>
										</div>
										{openMenus[key] && (
											<div className="row mx-3 p-2">
												{renderMenu(sidebarList[key], key)}
											</div>
										)}
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminHome;