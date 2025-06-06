// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   base: "/",
//   plugins: [react()],
//   preview: {
//     port: 8080,
//     strictPort: true,
//   },
//   server: {
//     port: 8080,
//     strictPort: true,
//     host: true,
//     origin: "http://0.0.0.0:8080",
//     allowedHosts: [
//       "fhpfrontend-c0cvdzhahegxdbah.brazilsouth-01.azurewebsites.net"
//     ]
//   },

// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-input-mask-next'],
  }

})

