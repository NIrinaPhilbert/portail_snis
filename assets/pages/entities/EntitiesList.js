import React,{ useState, useEffect} from 'react'
import { Link, useNavigate, Navigate } from "react-router-dom"
import Layout from "../../components/Layout"
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function EntitiesList() {
    const  [entitiesList, setEntitiesList] = useState([])
    const  [isFecthed, setIsFetched] = useState(false)
    const navigate = useNavigate()
    const shouldRedirect = (localStorage.getItem('mysession') === null) ? true : false

    if (shouldRedirect) {
    	showLoader()
		return (
			<>
				{shouldRedirect && window.location.reload()}
			</>
		);
	}

	const columns = [
        {
            name: '#ID',
            selector: row => row.id,
            sortable: true,
            cell: row => <div style={{display: 'block'}}><b>#{row.id}</b></div>
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.name}</div>
        },
        {
            name: 'Direction',
            selector: row => row.direction,
            sortable: false,
            cell: row => <div style={{display: 'block', minWidth: '120px'}}>{row.direction}</div>
        },
        {
            name: 'Date',
            selector: row => row.createdAt,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.createdAt}</div>
        },
        {
            name: 'Actions',
            selector: row => row.actions,
            sortable: false,
            cell: row => <div style={{display: 'inherit'}}>{row.actions}</div>
        },
    ];
    const paginationComponentOptions = {
        rowsPerPageText: 'Lignes par page',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
    };
  
    useEffect(() => {
        fetchEntitiesList()
    }, [])
  
    const fetchEntitiesList = () => {
    	setIsFetched(false)
        showLoader()
        axios.get('/api/entitys')
        .then(function (response) {
			setIsFetched(true)
			response.data.map((entity, key)=>{
                entity.actions = (
                    <>
                        <Link
                            className="btn btn-sm btn-outline-success mx-1"
                            to={`/admin/entities/edit/${entity.id}`}>
                            <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button 
                            onClick={()=>handleDelete(entity.id)}
                            className="btn btn-sm btn-outline-danger mx-1">
                            <i className="bi bi-trash"></i>
                        </button>
                    </>
                )
                return entity
            })
			setEntitiesList(response.data)
			hideLoader()
        })
        .catch(function (error) {
            toast.error('Une erreur est survenue.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        })
    }

    const handleRefresh = () => {
    	fetchEntitiesList()
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Voulez-vous supprimer cette entité?',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
	            confirmButton: 'btn btn-md btn-outline-primary',
	            cancelButton: 'btn btn-md btn-outline-secondary ms-2'
	        },
	        buttonsStyling: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
                showLoader()
                axios.delete(`/api/entitys/remove/${id}`)
                .then(function (response) {
                	if (response.data.success) {
	                    toast.success("Entité supprimée avec succès.", {
	                        position: "top-right",
	                        autoClose: 5000,
	                        hideProgressBar: false,
	                        closeOnClick: true,
	                        pauseOnHover: true,
	                        draggable: true,
	                        progress: undefined,
	                        theme: "colored",
	                    })
	                    fetchEntitiesList()
	                } else {
	                	toast.error('Suppression impossible.', {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "colored",
						});
						hideLoader()
	                }
                })
                .catch(function (error) {
                    toast.error('Une erreur est survenue.', {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
                    hideLoader()
                });
            }
          })
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Entités</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/entities">Entités</Link></li>
                        <li className="breadcrumb-item active">Liste</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <div className="card-body p-3">
                            	<div className="mb-2 mt-1">
                                	<Link
                                        to="/admin/entities/new"
                                        className="btn btn-sm btn-outline-primary mx-1">
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Créer
                                    </Link>
                                    <button 
                                        onClick={()=>handleRefresh()}
                                        className="btn btn-sm btn-outline-secondary mx-1">
                                        <i className="bi bi-bootstrap-reboot me-1"></i>
                                        Actualiser
                                    </button>
            					</div>
                                <DataTable 
                                    columns={columns} 
                                    data={entitiesList} 
                                    pagination 
                                    paginationComponentOptions={paginationComponentOptions} 
                                    progressComponent={<div className="text-sm p-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>} 
                                    progressPending={!isFecthed} 
                                    highlightOnHover={true} 
                                    noDataComponent={<div className="p-2">Aucune entité trouvée.</div>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
  
export default EntitiesList;