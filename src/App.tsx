// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  StyledEngineProvider // <--- IMPORTANTE
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#005f73' },
    secondary: { main: '#94d2bd' },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst> {/* <--- ISSO FAZ O TAILWIND FUNCIONAR */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;