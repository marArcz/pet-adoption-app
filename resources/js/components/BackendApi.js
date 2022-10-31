import axios from "axios"


export const PetsApi = {
    getAll: async (categoryId = '') => {
        if (categoryId === "") {
            return axios.get(`/pets`)
                .then(res => res.data)
        } else {
            return axios.get(`/pets/${categoryId}`)
                .then(res => res.data)
        }
    },
    delete: async (petId) => {
        return axios.get(`/pets/${petId}/delete`)
            .then(res => res)
            .catch(err => err)
    },
    insert: async ({ name, age, description, gender, address, categoryId, breedIds, vaccineIds, photos }) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        console.log("breedIds: ", breedIds)
        console.log("vaccineIds: ", vaccineIds)
        var formData = new FormData();
        formData.append("name", name)
        formData.append("age", age)
        formData.append("description", description)
        formData.append("gender", gender)
        formData.append("address", address)
        formData.append("categoryId", categoryId.toString())
        for (let breedId of breedIds) {
            formData.append("breedId[]", breedId.toString())
        }
        for (let vaccineId of vaccineIds) {
            formData.append("vaccineId[]", vaccineId.toString())
        }
        for (let photo of photos) {
            formData.append("photo[]", photo)
        }
        console.log("formdata: ", formData)


        return axios.post("/pets/insert", formData, config)
            .then(res => res)
            .catch(err => err)
    },
    update: async (pet) => {
        var formData = new FormData();
        console.log("updating pet: ", pet.id)

        formData.append("id", pet.id.toString())

        formData.append("name", pet.name)
        formData.append("age", pet.age)
        formData.append("description", pet.description)
        formData.append("gender", pet.gender)
        formData.append("address", pet.address)
        formData.append("categoryId", pet.categoryId.toString())

        for (let breedId of pet.breedIds) {
            formData.append("breedId[]", breedId.toString())
        }
        for (let vaccineId of pet.vaccineIds) {
            formData.append("vaccineId[]", vaccineId.toString())
        }

        return axios.post('/pets/update', formData)
            .then(res => res)
            .catch(err => err)
    },
    addPhotos: async (petId, photos, isMain = false) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append("petId", petId);

        for (let photo of photos) {
            formData.append("photo[]", photo)
        }

        if (isMain) {
            formData.append("isMain", true)
        }

        return axios.post("/pets/photos/insert", formData, config)
            .then(res => res)
            .catch(err => err)
    },
    deletePhoto: async (id) => {
        return axios.get(`/pets/photos/${id}/delete`)
            .then(res => res)
            .catch(err => err)
    },
    setMainPhoto: async (petId, photoId) => {
        return axios.post("/pets/photos/setMain", {
            petId, photoId
        })
            .then(res => res)
            .catch(err => {
                console.log("setting main: ", err)
                return err
            })
    }
}

export const AdminApi = {
    login: async (email, password) => {
        return axios.post('/admin/login', {
            email,
            password
        })
            .then(res => res)
            .catch(err => err)
    },
    getCurrentAdmin: async (userToken) => {
        return axios.get("/admin/me", {
            headers: {
                authorization: `${userToken.type} ${userToken.value}`,
                accept: 'application/json'
            }
        }).then(res => res)
            .catch(err => err)
    },
    signup: async ({ firstname, middlename, lastname, photo, email, password, selectedPhoto }) => {
        console.log('photo: ', selectedPhoto)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append("firstname", firstname)
        formData.append("middlename", middlename)
        formData.append("lastname", lastname)
        formData.append("email", email)
        formData.append("password", password)
        if(selectedPhoto !== null){
            formData.append("photo", selectedPhoto)
        }
        return axios.post('/admin/register', formData, config)
            .then(res => res)
            .catch(err => err)
    },
    update: async ({id, firstname, middlename, lastname, selectedPhoto, email,password,isChangingPassword }) => {

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append("id",id)
        formData.append("firstname", firstname)
        formData.append("middlename", middlename)
        formData.append("lastname", lastname)
        formData.append("email", email)
        if (selectedPhoto !== null) {
            formData.append("photo", selectedPhoto)
        }
        if(isChangingPassword){
            formData.append("password",password)
        }
        return axios.post('/admin/update', formData, config)
            .then(res => res)
            .catch(err => {
                console.log(err)
                return err
            })

    }
}

export const BreedsApi = {
    getAll: async (categoryId) => {
        return axios.get(`/breeds/${categoryId}/getAll`)
            .then(res => res.data)
    },
    insert: async (name, categoryId) => {
        return axios.post('/breeds/insert', {
            name, categoryId
        })
            .then(res => res)
            .catch(err => err)
    },
    update: async (id, name) => {
        return axios.post('/breeds/update', {
            id, name
        })
            .then(res => res)
            .catch(err => err)
    },
    delete: async (id) => {
        return axios.post('/breeds/delete', { id })
            .then(res => res)
            .catch(err => err)
    }
}
export const VaccineApi = {
    getAll: async (categoryId) => {
        return axios.get(`/vaccines/${categoryId}/getAll`)
            .then(res => res.data)
    },
    insert: async (name, categoryId) => {
        return axios.post('/vaccines/insert', {
            name, categoryId
        })
            .then(res => res)
            .catch(err => err)
    },
    delete: async (id) => {
        return axios.post('/vaccines/delete', { id })
            .then(res => res)
            .catch(err => err)
    },
    update: async (id, name) => {
        return axios.post("/vaccines/update", { id, name })
            .then(res => res)
            .catch(err => err)
    }
}


export const CategoryApi = {
    getAll: async () => {
        return axios.get(`/categories`)
            .then(res => res.data)
    },
    getOne: async (categoryId) => {
        return axios.get(`/categories/getOne/${categoryId}`)
            .then(res => res.data)
            .catch(err => err)
    },
    insert: async (name) => {
        return axios.post('/categories/insert', {
            name
        })
            .then(res => res)
            .catch(err => err)
    },
    update: async (id, name) => {
        return axios.post('/categories/update', {
            id, name
        })
            .then(res => res)
            .catch(err => err)
    },
    delete: async (id) => {
        return axios.get(`/categories/${id}/delete`)
            .then(res => res)
            .catch(err => err)
    }
}

export const AdoptersApi = {
    getAll: async () => {
        return axios.get('/adopters')
            .then(res => res.data)
            .catch(err => {
                throw err;
            })
    }
}
