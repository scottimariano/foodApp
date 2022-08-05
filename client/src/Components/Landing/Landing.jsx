import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import video from '../../media/pexels-mart-production-8107400.mp4';
import landing from './landing.module.css';
import { useSelector } from 'react-redux';

const Landing = (props) => {
	const [loading, setLoading] = useState(true);
	const recipes = useSelector((state) => state.diets);

	useEffect(() => {
		setLoading(false);
	}, [recipes]);

	return (
		<div className={`${landing.canvas}`}>
			<video
				autoPlay
				muted
				loop
				id="myVideo"
				className={`${landing.myVideo}`}>
				<source src={video} type="video/mp4" />
			</video>
			<div className={`${landing.content}`}>
				<h1 className={`${landing.logo}`}>- RECIPE TOWN -</h1>
				<p className={`${landing.logo}`}> - Discover your next desire -</p>

				<div>
					{loading ? (
						<p>Loading...</p>
					) : (
						<Link className={`${landing.inButton}`} to="/">
							<div id="inButton" className={`${landing.inButton}`}>
								LET'S COOK
							</div>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default Landing;
