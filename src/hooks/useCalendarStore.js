import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from "../store";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar )
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {
      // TODO:  llegar al backend

      try {
       // Todo bien
       if( calendarEvent.id ) {        // actualizando
       
          await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent)
          dispatch( onUpdateEvent ({ ...calendarEvent, user }))
          return;
       } 

      // creando nuevo
        const { data } = await calendarApi.post('/events', calendarEvent)
        dispatch ( onAddNewEvent( { ...calendarEvent, id: data.evento.id, user } ) )
        
      } catch (error) {
        console.log(error);
        Swal.fire('Error al guardar', error.response.data.msg, 'error')
        
      }
      
      
    }

    const startLoadingEvents = async() => {
      try {

        const { data } = await calendarApi.get('/events');
        const events = convertEventsToDateEvents( data.eventos );
        dispatch( onLoadEvents(events));

      } catch (error) {

        console.log('Error cargando eventos');
        console.log(error);

      }
    }

    const startDeletingEvent = async ( calendarEvent ) => {
      console.log(calendarEvent)
      try {
        await calendarApi.delete(`/events/${ calendarEvent.id }`)
        dispatch( onDeleteEvent() )
      } catch (error) {
        console.log(error);
        Swal.fire('Error al eliminar', error.response.data.msg, 'error')
      }
     
    }



  return {
    //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

    //* Methodos
      setActiveEvent,
      startSavingEvent,
      startLoadingEvents,
      startDeletingEvent

  }
   
    
  
}
