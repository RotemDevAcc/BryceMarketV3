import React, { useEffect, useState, useCallback, ChangeEvent } from 'react'
import { getAdminProductsAsync, get_admin_categories, get_admin_products, selectastatus } from './managementSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { get_user_token } from '../login/loginSlice';
import { TargetServer } from '../settings/settings';
import { Message } from '../../Message';
import { Button, Modal } from 'react-bootstrap';
import { AllProductDetails } from './managementSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const Adminproducts = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectastatus);
    const allproducts = useAppSelector(get_admin_products)
    const allcategories = useAppSelector(get_admin_categories)
    const token = useAppSelector(get_user_token)
    const [displayprods, setdisplayprods] = useState<JSX.Element | string>('');
    const [showModal, setshowModal] = useState(false)
    const [showSecondModal, setshowSecondModal] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<AllProductDetails | null>();
    const [FormDATA, setFormDATA] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: null, // Assuming the image is a file, set it to null or provide a default value.
        ...currentProduct,
    });

    const GetCategoryName = useCallback((category: number) => {
        const foundCategory = allcategories.find((cat) => cat.id === category);
        return foundCategory ? foundCategory.desc : 'Category Not Found';
    }, [allcategories]);



    const GetProduct = useCallback((product: number) => {
        const foundProduct = allproducts.find((p) => p.id === product);
        return foundProduct ? foundProduct : null;
    }, [allproducts]);

    const manage_product = useCallback((product: number) => {
        let fproduct = GetProduct(product);
        if (fproduct) {
            setCurrentProduct(fproduct);
            setshowModal(true);
        } else {
            setCurrentProduct(null);
            Message('Product Was Not Found', 'error');
        }
    }, [GetProduct]);

    const close_productmodal = () => {
        setshowModal(false)
        setshowSecondModal(false)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormDATA((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(FormDATA);
    };


    useEffect(() => {
        dispatch(getAdminProductsAsync(token))
    }, [dispatch, token])

    useEffect(() => {

        let element =
            <div className="container mt-4">
                <ul className="list-group">
                    <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
                        {allproducts.map((prod, index) => (
                            <div key={index} className="col-md-4" style={{ padding: "15px", flex: "1 0 300px" }}>
                                <div className="card" style={{ height: "100%" }}>
                                    <img style={{ width: "150px", height: "150px" }} className="img-fluid card-img-top" src={`${TargetServer}${prod.img}`} alt="Product"></img>
                                    <div className="card-body" style={{ display: "flex", flexDirection: "column" }}>
                                        <div>
                                            <h5 className="card-title">{prod.name}</h5>
                                            <p className="card-text">Description: {prod.desc}</p>
                                            <p className="card-text">Price: ${prod.price}</p>
                                            <p className="card-text">Category: {prod.category} - {GetCategoryName(prod.category)}</p>
                                            <button className="btn btn-sm btn-primary shorter-button" onClick={() => { manage_product(prod.id) }}><FontAwesomeIcon icon={faEdit} /> Manage</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ul>
            </div>


        setdisplayprods(element)
    }, [allproducts, allcategories, GetCategoryName, manage_product])

    const addProduct = () => {
        console.log("Add Product")
    }

    const addCategory = () => {
        console.log("Add Category")
    }

    const categoryOptions = allcategories && allcategories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.desc}</option>
    ));

    return (
        <div>
            {status === "done" ? (
                <div>
                    <div className="text-center mt-3">
                        <button className="btn btn-success" onClick={() => addProduct()}>Add Product <FontAwesomeIcon icon={faPlus} /></button>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => addCategory()}>Add Category <FontAwesomeIcon icon={faPlusCircle} /></button>
                    </div>

                    {displayprods}
                </div>
            ) : <></>}
            <Modal show={showModal} onHide={() => close_productmodal()}>
                {currentProduct && (
                    <Modal.Header>
                        <Modal.Title>{currentProduct.id} - {currentProduct.name}</Modal.Title>
                    </Modal.Header>
                )}
                <Modal.Body>
                    <Button style={{ marginRight: "10px" }} variant="primary" onClick={() => setshowSecondModal(true)}>
                    Edit <FontAwesomeIcon icon={faEdit} />
                    </Button>

                    <Button variant="danger" onClick={() => close_productmodal()}>
                    Close <FontAwesomeIcon icon={faClose} />
                    </Button>
                </Modal.Body>
            </Modal>
            {/* Second Modal */}
            <Modal show={showSecondModal} onHide={() => close_productmodal()}>
                <Modal.Header>
                    {currentProduct && (
                        <Modal.Title>
                            {currentProduct.id} - {currentProduct.name}
                        </Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="editProductName">Name:</label>
                        <input
                            type="text"
                            id="editProductName"
                            name="name"
                            value={FormDATA.name}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <label htmlFor="editProductDesc">Description:</label>
                        <input
                            type="text"
                            id="editProductDesc"
                            name="description"
                            value={FormDATA.desc}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <label htmlFor="editProductPrice">Price:</label>
                        <input
                            type="number"
                            id="editProductPrice"
                            name="price"
                            value={FormDATA.price}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <label htmlFor="edit_category">Category:</label>
                        <select
                            name="category"
                            required
                            id="edit_category"
                            value={FormDATA.category}
                            onChange={(event) => handleChange(event)}
                        >
                            <option value="">
                                ---------
                            </option>
                            {categoryOptions}
                        </select>
                        <br />
                        <label htmlFor="editProductImage">Image (PNG format, max 2MB):</label>
                        <input
                            type="file"
                            id="editProductImage"
                            name="image"
                            accept=".png"
                            required
                        />
                        <br />
                        <hr />
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Adminproducts