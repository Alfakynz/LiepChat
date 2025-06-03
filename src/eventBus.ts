import mitt from 'mitt'

type Events = {
  userUpdated: void
}

const emitter = mitt<Events>()

export default emitter
