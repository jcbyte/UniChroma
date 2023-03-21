import React, { useState, useEffect } from "react";

import {
	List,
	ListItem,
	IconButton,
	TextField,
	Modal,
	Button,
	Typography,
	Backdrop,
	CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { apiGetSaves, apiGetSave, apiGetSetSave, apiCreateSave, apiDeleteSave, apiRenameSave } from "../api/APIHandler";
import { useStateWithPromiseLazy as useStatePromiseLazy } from "../tools/ReactTools";

export default function SavePage({ smartSave, setSmartSave, apiServer, showAlert, loadServerSettings_FLAG }) {
	const [saveName, setSaveName] = useState("");
	const [importExportData, setImportExportData] = useState({ open: false, type: "import", string: "==", rows: 10 });
	const [effects, setEffects] = useState([]);
	const [editingData, setEditingData] = useStatePromiseLazy({ index: -1, prevName: "" });
	const [deleteIndex, setDeleteIndex] = useState(-1);

	const [savingLoading_FLAG, setSavingLoading_FLAG] = useStatePromiseLazy(true);

	function getEffects() {
		apiGetSaves(apiServer)
			.then((data) => {
				setEffects(data ?? []);
			})
			.catch(() => {
				showAlert("Cannot connect to server", "error");
			})
			.finally(() => {
				setSavingLoading_FLAG(false);
			});
	}

	useEffect(getEffects, []);

	useEffect(() => {
		if (loadServerSettings_FLAG.do) {
			getEffects();
		}
	}, [loadServerSettings_FLAG]);

	function loadEffect(index) {
		setSavingLoading_FLAG(true).then(() => {
			apiGetSetSave(apiServer, effects[index])
				.then((data) => {
					setSmartSave(data);
					showAlert("Loaded effect", "success");
				})
				.catch(() => {
					showAlert("Cannot connect to Server", "error");
				})
				.finally(() => {
					setSavingLoading_FLAG(false);
				});
		});
	}

	function importEffect() {
		try {
			var newSmartSave = JSON.parse(atob(importExportData.string));
			setSmartSave(newSmartSave);
			var newImportExportData = { ...importExportData, open: false };
			setImportExportData(newImportExportData);
			showAlert("Imported effect", "success");
		} catch {
			showAlert("Invalid import string", "error");
		}
	}

	function exportEffect(index) {
		if (index < 0) {
			var newImportExportData = {
				...importExportData,
				open: true,
				type: "export",
				string: btoa(JSON.stringify(smartSave)),
			};
			setImportExportData(newImportExportData);
			showAlert("Exported effect", "success");
		} else {
			setSavingLoading_FLAG(true).then(() => {
				apiGetSave(apiServer, false, effects[index])
					.then((data) => {
						var newImportExportData = {
							...importExportData,
							open: true,
							type: "export",
							string: btoa(JSON.stringify(data)),
						};
						setImportExportData(newImportExportData);
						showAlert("Exported effect", "success");
					})
					.catch(() => {
						showAlert("Cannot connect to Server", "error");
					})
					.finally(() => {
						setSavingLoading_FLAG(false);
					});
			});
		}
	}

	function saveEffect() {
		if (effects.includes(saveName)) {
			showAlert("Effect name already exists", "error");
			return;
		}

		setSavingLoading_FLAG(true).then(() => {
			apiCreateSave(apiServer, saveName, smartSave)
				.then(() => {
					var newEffects = [...effects];
					newEffects.push(saveName);
					setEffects(newEffects);
					setSaveName("");
					showAlert("Saved effect", "success");
				})
				.catch(() => {
					showAlert("Cannot connect to server", "error");
				})
				.finally(() => {
					setSavingLoading_FLAG(false);
				});
		});
	}

	function beginEditEffect(index) {
		if (editingData.index >= 0) cancelEditEffect();

		var newEditingData = { ...editingData, index: index, prevName: effects[index] };
		setEditingData(newEditingData).then(() => {
			var saveListItemName = document.getElementById("saveListItem" + index + "Name");
			saveListItemName.focus();
		});
	}

	function cancelEditEffect() {
		var newEffects = [...effects];
		newEffects[editingData.index] = editingData.prevName;
		setEffects(newEffects);
		var newEditingData = { ...editingData, index: -1 };
		setEditingData(newEditingData);
	}

	function saveEditEffect() {
		if (effects.filter((effect) => effect == effects[editingData.index]).length > 1) {
			showAlert("Effect name already exists", "error");
		} else {
			setSavingLoading_FLAG(true).then(() => {
				apiRenameSave(apiServer, editingData.prevName, effects[editingData.index])
					.then(() => {
						var newEditingData = { ...editingData, index: -1 };
						setEditingData(newEditingData);
						showAlert("Renamed", "success");
					})
					.catch(() => {
						showAlert("Cannot connect to server", "error");
					})
					.finally(() => {
						setSavingLoading_FLAG(false);
					});
			});
		}
	}

	function deleteEffect(index) {
		if (deleteIndex == index) {
			setSavingLoading_FLAG(true).then(() => {
				apiDeleteSave(apiServer, effects[deleteIndex])
					.then(() => {
						var newEffects = [...effects];
						newEffects.splice(deleteIndex, 1);
						setEffects(newEffects);
						setDeleteIndex(-1);
						showAlert("Deleted", "success");
					})
					.catch(() => {
						showAlert("Cannot connect to server", "error");
					})
					.finally(() => {
						setSavingLoading_FLAG(false);
					});
			});
		} else {
			setDeleteIndex(index);
		}
	}

	function getImportExportModalRows() {
		var importExportModal = document.getElementById("importExportModal");
		var importButton = document.getElementById("importButton");

		if (importExportModal) {
			var newImportExportData = {
				...importExportData,
				rows:
					(importExportModal.clientHeight - 33 /* padding */ - (importButton ? importButton.clientHeight + 10 : 0)) /
					23 /* row height */,
			};
			setImportExportData(newImportExportData);
		}
	}

	useEffect(getImportExportModalRows, [importExportData.open]);

	return (
		<>
			<Modal
				keepMounted
				open={importExportData.open}
				onClose={() => {
					var newImportExportData = { ...importExportData, open: false };
					setImportExportData(newImportExportData);
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "75%",
						height: "75%",
						backgroundColor: "#1e1e1e",
						borderRadius: "6px",
						padding: "10px",
					}}
				>
					<div
						id="importExportModal"
						style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "stretch" }}
					>
						<div style={{ marginBottom: importExportData.type == "import" ? "10px" : 0 }}>
							<TextField
								value={importExportData.string}
								onChange={(e) => {
									if (importExportData.type == "import") {
										var newImportExportData = { ...importExportData, string: e.target.value };
										setImportExportData(newImportExportData);
									}
								}}
								placeholder="Import String"
								rows={importExportData.rows}
								fullWidth
								multiline
							/>
						</div>

						{importExportData.type == "import" ? (
							<Button id="importButton" variant="contained" fullWidth onClick={importEffect}>
								Import
							</Button>
						) : (
							<></>
						)}
					</div>
				</div>
			</Modal>

			<div style={{ position: "absolute", width: "100%", height: "100%" }}>
				<Backdrop
					sx={{ color: "#FFFFFF", zIndex: (theme) => theme.zIndex.drawer + 1, position: "absolute" }}
					open={savingLoading_FLAG}
				>
					<CircularProgress color="inherit" />
				</Backdrop>

				<div style={{ height: "100%", margin: "10px" }}>
					<div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 10px)" }}>
						{effects.length == 0 ? (
							<Typography variant="body1" sx={{ textAlign: "center" }}>
								No Saves
							</Typography>
						) : (
							<></>
						)}
						<List sx={{ width: "100%", overflow: "auto" }}>
							{effects.map((e, index) => {
								return (
									<ListItem sx={{ borderBottom: "1px solid #ffffff22" }}>
										<IconButton
											onClick={() => {
												loadEffect(index);
											}}
										>
											<PlayArrowIcon />
										</IconButton>
										<TextField
											id={"saveListItem" + index + "Name"}
											variant="standard"
											onChange={(e) => {
												var newEffects = [...effects];
												newEffects[index] = e.target.value;
												setEffects(newEffects);
											}}
											value={e}
											disabled={editingData.index != index}
											sx={{
												"& .MuiInputBase-input.Mui-disabled": {
													WebkitTextFillColor: "#fff",
												},
											}}
											InputProps={{ disableUnderline: editingData.index != index }}
										/>
										{editingData.index != index ? (
											<IconButton
												onClick={() => {
													beginEditEffect(index);
												}}
											>
												<EditIcon />
											</IconButton>
										) : (
											<>
												<IconButton onClick={saveEditEffect}>
													<CheckIcon />
												</IconButton>
												<IconButton onClick={cancelEditEffect}>
													<ClearIcon />
												</IconButton>
											</>
										)}
										<div style={{ marginRight: 0, marginLeft: "auto" }}>
											<IconButton
												onClick={() => {
													exportEffect(index);
												}}
											>
												<FileUploadIcon />
											</IconButton>
											<IconButton
												onClick={() => {
													deleteEffect(index);
												}}
											>
												{deleteIndex == index ? <DeleteForeverIcon /> : <DeleteIcon />}
											</IconButton>
										</div>
									</ListItem>
								);
							})}
						</List>

						<div style={{ display: "flex", alignItems: "center" }}>
							<TextField
								value={saveName}
								sx={{ marginBottom: "10px" }}
								onChange={(e) => {
									setSaveName(e.target.value);
								}}
								label="Name"
								variant="standard"
								fullWidth
							/>

							<IconButton onClick={saveEffect}>
								<SaveIcon />
							</IconButton>

							<IconButton
								onClick={() => {
									exportEffect(-1);
								}}
							>
								<FileUploadIcon />
							</IconButton>
							<IconButton
								onClick={() => {
									var newImportExportData = { ...importExportData, open: true, type: "import", string: "" };
									setImportExportData(newImportExportData);
								}}
							>
								<FileDownloadIcon />
							</IconButton>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
