/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import GenreModel from "../../model/GenreModel";
import { getAllGenres } from "../../api/GenreApi";
import { AdminEnpoint } from "../../admin/AdminEnpoint";
import {
	getAvatarByToken,
	getLastNameByToken,
	getRoleByToken,
	isToken,
	logout,
} from "../utils/JwtService";
import { Avatar, Button } from "@mui/material";
import { useAuth } from "../utils/AuthContext";
import { useCartItem } from "../utils/CartItemContext";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props) => {
	const { totalCart, setTotalCart, setCartList } = useCartItem();
	const { setLoggedIn } = useAuth();
	const navigate = useNavigate();

	// Lấy tất cả thể loại
	const [genreList, setGenreList] = useState<GenreModel[]>([]);
	const [erroring, setErroring] = useState(null);

	useEffect(() => {
		getAllGenres()
			.then((response) => {
				setGenreList(response.genreList);
			})
			.catch((error) => {
				setErroring(error.message);
			});
	}, []);

	if (erroring) {
		console.error(erroring);
	}

	const location = useLocation();
	const adminEnpoint = AdminEnpoint; // Thêm các path bạn muốn ẩn Navbar vào đây

	if (adminEnpoint.includes(location.pathname)) {
		return null; // Nếu location.pathname nằm trong danh sách ẩn, trả về null để ẩn Navbar
	}

	return (
		<nav
			className='navbar navbar-expand-lg navbar-light bg-dark sticky-top text-white'
			style={{zIndex: 2}}
		>
			{/* <!-- Container wrapper --> */}
			<div className='container-fluid'>
				{/* <!-- Toggle button --> */}
				<button
					className='navbar-toggler'
					type='button'
					data-mdb-toggle='collapse'
					data-mdb-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<i className='fas fa-bars'></i>
				</button>
				{/* <!-- Collapsible wrapper --> */}
				<div
					className='collapse navbar-collapse'
					id='navbarSupportedContent'
				>
					{/* <!-- Navbar brand --> */}
					<Link className='navbar-brand mt-2 mt-lg-0 ' to='/'>
						<img
							src={"/images/public/BookStore.png"}
							width='50'
							alt='MDB Logo'
							loading='lazy'
						/>
					</Link>
					{/* <!-- Left links --> */}
					<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
						<li className='nav-item'>
							<NavLink className='nav-link text-white' to='/'>
								Trang chủ
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link text-white' to='/about'>
								Giới thiệu
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link text-white' to='/search'>
								Kho sách
							</NavLink>
						</li>
						<li className='nav-item dropdown dropdown-hover'>
							<a
								className='nav-link dropdown-toggle text-white'
								href='#'
								role='button'
								data-bs-toggle='dropdown'
								aria-expanded='false'
							>
								Thể loại
							</a>
							<ul className='dropdown-menu'>
								{genreList.map((genre, index) => {
									return (
										<li key={index}>
											<Link
												className='dropdown-item text-dark'
												to={`/search/${genre.idGenre}`}
											>
												{genre.nameGenre}
											</Link>
										</li>
									);
								})}
							</ul>
						</li>
						<li className='nav-item'>
							<Link className='nav-link text-white' to={"/policy"}>
								Chính sách
							</Link>
						</li>
					</ul>
					{/* <!-- Left links --> */}
				</div>
				{/* <!-- Collapsible wrapper --> */}
				{/* <!-- Right elements --> */}
				<div className='d-flex align-items-center gap-3' style={{minHeight: 48}}>
					{/* <!-- Shopping Cart --> */}
					<Link
						className='position-relative d-flex align-items-center justify-content-center'
						to='/cart'
						style={{width: 40, height: 40}}
					>
						<i className='fas fa-shopping-cart fa-lg text-white'></i>
						{totalCart ? (
							<span
								className='badge rounded-pill badge-notification bg-danger position-absolute top-0 start-100 translate-middle'
								style={{fontSize: 11, minWidth: 18, height: 18, padding: 0}}
							>
								{totalCart}
							</span>
						) : null}
					</Link>
					{!isToken() && (
						<div>
							<Link to={"/login"}>
								<Button className='text-white' style={{padding: "6px 16px", minWidth: 80}}>Đăng nhập</Button>
							</Link>
						</div>
					)}

					{isToken() && (
						<>
							{/* <!-- Notifications --> */}
							<div className="dropdown position-relative d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
								<button
									className="btn text-reset p-0 border-0"
									id="navbarDropdownMenuLink"
									data-bs-toggle="dropdown"
									aria-expanded="false"
									style={{background: "transparent", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center"}}
								>
									<i className="fas fa-bell fa-lg text-white"></i>

								</button>
								<ul
									className="dropdown-menu dropdown-menu-end"
									aria-labelledby="navbarDropdownMenuLink"
								>
									<li>
										<a className="dropdown-item" href="#">
											Some news
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Another news
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Something else here
										</a>
									</li>
								</ul>
							</div>

							{/* <!-- Avatar --> */}
							<div className="dropdown d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
								<button
									className="btn dropdown-toggle d-flex align-items-center p-0 border-0"
									id="navbarDropdownMenuAvatar"
									data-bs-toggle="dropdown"
									aria-expanded="false"
									style={{background: "transparent", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center"}}
								>
									<Avatar
										alt={getLastNameByToken()?.toUpperCase()}
										src={getAvatarByToken()}
										sx={{width: 32, height: 32, fontSize: "14px"}}
									/>
								</button>
								<ul className="dropdown-menu dropdown-menu-end"
									aria-labelledby="navbarDropdownMenuAvatar">
									<li>
										<Link to="/profile" className="dropdown-item">
											Thông tin cá nhân
										</Link>
									</li>
									<li>
										<Link to="/my-favorite-books" className="dropdown-item">
											Sách yêu thích của tôi
										</Link>
									</li>
									{getRoleByToken() === "ADMIN" && (
										<li>
											<Link to="/admin/dashboard" className="dropdown-item">
												Quản lý
											</Link>
										</li>
									)}
									<li>
										<button
											className="dropdown-item"
											onClick={() => {
												setTotalCart(0);
												logout(navigate);
												setLoggedIn(false);
												setCartList([]);
											}}
											style={{cursor: "pointer"}}
										>
											Đăng xuất
										</button>
									</li>
								</ul>
							</div>
						</>
					)}
				</div>
				{/* <!-- Right elements --> */}
			</div>
			{/* <!-- Container wrapper --> */}
		</nav>
	);
};

export default Navbar;
