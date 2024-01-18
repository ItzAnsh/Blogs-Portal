import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import toast from "react-hot-toast";
import axios from "axios";

const Admin = () => {
	// admin should be able to give write permission to users
	// admin should be able to delete posts
	const userInfo = useContext(UserContext);
	const [posts, setPosts] = useState([]);
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(false);

	const dataFetcher = async () => {
		try {
			const response = await axios.get(URL + "/api/admin", {
				withCredentials: true,
			});
			setPosts(response.data.posts);
			setUsers(response.data.users);
			console.log(response);
		} catch (e) {
			console.log(e);
			toast.error(e.response.data);
			setError(true);
		}
	};

	const postDelete = async (postId) => {
		try {
			const response = await axios.delete(
				URL + "/api/admin/deletePost/" + postId,
				{
					withCredentials: true,
				}
			);
			console.log(response);
			dataFetcher();
		} catch (e) {
			console.log(e);
			toast.error(e.response.data);
		}
	};

	const userDelete = async (userId) => {
		try {
			const response = await axios.delete(
				URL + "/api/admin/deleteUser/" + userId,
				{
					withCredentials: true,
				}
			);
			dataFetcher();
			console.log(response);
		} catch (e) {
			console.log(e);
			toast.error(e.response.data);
		}
	};

	useEffect(() => {
		dataFetcher();
	}, []);
	return (
		<div className="w-full container mx-auto">
			{error ? (
				<>Error fetching</>
			) : (
				<div className="flex w-full gap-x-8">
					<div className="w-1/2">
						<h1 className="text-2xl font-bold text-center">Posts</h1>
						<div className="flex flex-col space-y-2">
							{posts.map((post) => (
								<div className="flex justify-between w-full border-2 border-black p-4 rounded-md">
									<div className="flex flex-col space-y-2 ">
										<h1 className="text-xl font-bold">{post.title}</h1>
										<p className="text-lg">{post.body}</p>
									</div>
									<div className="deleteBtn">
										<button
											className="bg-red-500 text-white px-4 py-2 rounded-md"
											onClick={() => postDelete(post._id)}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="w-1/2">
						<h1 className="text-2xl font-bold text-center">Users</h1>
						<div className="flex flex-col space-y-2">
							{users.map((user) => (
								<div className="flex justify-between w-full border-2 border-black p-4 rounded-md">
									<div className="flex flex-col space-y-2 ">
										<h1 className="text-xl font-bold">{user.name}</h1>
										<p className="text-lg">{user.email}</p>
									</div>
									<div className="deleteBtn">
										<button
											className="bg-red-500 text-white px-4 py-2 rounded-md"
											onClick={() => userDelete(user._id)}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Admin;
