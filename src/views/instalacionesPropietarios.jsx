
import { Container, Grid, TextField, Typography } from '@mui/material'
import EventRoomCard from 'src/components/roomCard'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment } from '@material-ui/core'
import usuarioService from 'src/Services/usuario.service'
import instalacionService from 'src/Services/instalacionService'
import InstalacionModal from 'src/components/InstalacionModal'
import DetallesInstalacion from 'src/components/DetallesInstalacion'
import ModalMantenimiento from 'src/components/BloquearFechaMantenimiento'

const InstalacionesPropietario = () => {
    const [openModalEditar, setOpenModalEditar] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [instalacionesProp, setInstalacionesProp] = useState([])
    const [terminoDeBusqueda, setTerminoDeBusqueda] = useState('')
    const [openModalDetalles, setOpenModalDetalles] = useState(false)
    const [openModalFecha, setOpenModalFecha] = useState(false)



    const fetchInstalaciones = async () => {
        const usuarioId = localStorage.getItem('usuId')
        if (!usuarioId) {
            console.error('User ID is not available in localStorage')
            return
        }

        try {
            const response = await usuarioService.traerInstalacionDePropietario(usuarioId)
            setInstalacionesProp(response)
            console.log("en la vista", response)
        } catch (error) {
            console.error('Error fetching installations:', error)
            setInstalacionesProp([])
        }
    }

    useEffect(() => {
        fetchInstalaciones()
    }, [])

    const handleRoomClickEditar = (room) => {
        setSelectedRoom(room)
        setOpenModalEditar(true)
    }

    const handleCloseModalEditar = () => {
        setOpenModalEditar(false)
    }

    const manejarCambioBúsqueda = (evento) => {
        setTerminoDeBusqueda(evento.target.value)
    }


    const busqueda = async () => {
        try {
            if (terminoDeBusqueda !== '') {
                const response = await instalacionService.busquedaDeInstalaciones(terminoDeBusqueda)
                setInstalacionesProp(response.data || [])
            } else {
                fetchInstalaciones()
            }
        } catch (error) {
            console.error('Error al obtener las instalaciones:', error)
            setInstalacionesProp([])
        }
    }
    const manejarPresionarEnter = (event) => {
        if (event.key === 'Enter') {
            busqueda()
        }
    }
    const handleRoomClickDetalles = (room) => {
        setSelectedRoom(room)
        setOpenModalDetalles(true)
    }
    const handleCloseModalDetalles = () => {
        setOpenModalDetalles(false)
    }

    const handleRoomClickFecha = () => {
        setOpenModalFecha(true)
    }

    const handleCloseModalFecha = () => {
        setOpenModalFecha(false)
    }
    return (
        <Container className="main" style={{ marginBottom: '10rem' }}>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                value={terminoDeBusqueda}
                onChange={manejarCambioBúsqueda}
                onKeyDown={manejarPresionarEnter}
                placeholder="Nombre del salón o localidad"
                InputProps={{
                    startAdornment:
                        <InputAdornment position="end">
                            <SearchIcon sx={{ paddingRight: 1 }} />
                        </InputAdornment>
                }}
            />
            <Grid container spacing={3} justifyContent="center" marginTop="0.5rem">
                {instalacionesProp && instalacionesProp.length > 0 ?
                    instalacionesProp.map((instalacion, index) =>
                        <Grid item key={index}>
                            <EventRoomCard
                                room={instalacion}
                                onClickEditar={() => handleRoomClickEditar(instalacion)}
                                onClickDetalles={() => handleRoomClickDetalles(instalacion)}
                                onClickFecha={() => handleRoomClickFecha()}

                                context={'Propietario'}

                            />
                        </Grid>
                    )
                    :
                    <Typography style={{ marginTop: '2rem', color: 'black' }}>
                        Aún no tienes instalaciones cargadas

                    </Typography>
                }
            </Grid>
            <InstalacionModal
                openModal={openModalEditar}
                cerrarModal={handleCloseModalEditar}
                instalacion={selectedRoom}
                actualizarInstalacion={fetchInstalaciones}
            />
            <DetallesInstalacion
                openModal={openModalDetalles}
                cerrarModal={handleCloseModalDetalles}
                instalacion={selectedRoom}


            />
            <ModalMantenimiento
                openModal={openModalFecha}
                cerrarModal={handleCloseModalFecha}
                instalacion={selectedRoom}



            />

        </Container>
    )
}

export default InstalacionesPropietario