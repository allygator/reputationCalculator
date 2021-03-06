import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import BnetContext from "../context/BnetContext";

function RealmList(props) {
	let token = useContext(BnetContext);
	const [options, setOptions] = useState({
		error: null,
		isLoaded: false,
		selectedRealm: "",
		selectedOption: null,
	});
	const [eu, setEU] = useState([]);
	const [us, setUS] = useState([]);

	function handleChange(selectedOption) {
		setOptions({ ...options, selectedOption: selectedOption });
		props.realmSelection(selectedOption.value, selectedOption.group);
	}

	useEffect(() => {
		const abortController1 = new AbortController();
		const abortController2 = new AbortController();
		if (token) {
			fetch(
				"https://us.api.blizzard.com/data/wow/realm/index?namespace=dynamic-us&locale=en_US&access_token=" +
					token,
				{ signal: abortController1.signal }
			)
				.then(
					(response) => response.json(),
					(othererror) => console.log(othererror)
				)
				.then(
					(realmList) => {
						setOptions((o) => ({ ...o, isLoaded: true }));
						setUS(realmList.realms);
					},
					(error) => {
						setOptions((o) => ({ ...o, isLoaded: true, error: error }));
					}
				);
			fetch(
				"https://eu.api.blizzard.com/data/wow/realm/index?namespace=dynamic-eu&locale=en_GB&access_token=" +
					token,
				{ signal: abortController2.signal }
			)
				.then(
					(response) => response.json(),
					(othererror) => console.log(othererror)
				)
				.then(
					(realmList) => {
						setOptions((o) => ({ ...o, isLoaded: true }));
						setEU(realmList.realms);
					},
					(error) => {
						setOptions((o) => ({ ...o, isLoaded: true, error: error }));
					}
				)
				.then(setOptions((current) => ({ ...current, isLoaded: true })));
			return () => {
				abortController1.abort();
				abortController2.abort();
			};
		}
	}, [token]);

	var USOptions = [];
	var EUOptions = [];
	for (let realm of us) {
		USOptions.push({ value: realm.slug, label: realm.name, group: "US" });
	}
	for (let realm of eu) {
		EUOptions.push({ value: realm.slug, label: realm.name, group: "EU" });
	}
	const groupedOptions = [
		{
			label: "US",
			options: USOptions,
		},
		{
			label: "EU",
			options: EUOptions,
		},
	];
	const groupStyles = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderBottom: "1px solid grey",
	};
	const formatGroupLabel = (data) => (
		<div style={groupStyles}>
			<span>{data.label}</span>
		</div>
	);
	return (
		<div id="realmSelector">
			{options.error?.message && <div>Error: {options.error.message}</div>}
			{!options.isLoaded && <div>Loading...</div>}
			{token && options.isLoaded && !options.error && (
				<Select
					onChange={handleChange}
					options={groupedOptions}
					formatGroupLabel={formatGroupLabel}
					placeholder="Realm"
					fullWidth
				/>
			)}
		</div>
	);
}

export default RealmList;
