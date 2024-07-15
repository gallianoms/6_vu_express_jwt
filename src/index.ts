import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Interfaces
interface UserCredentials {
  role: string;
  password: string;
}

interface Admin {
  id: string;
  name: string;
}

interface Customer extends Admin {}

// Constants
const validCredentials: Record<string, string> = {
  admin: 'admin',
  tester: 'tester',
  dev: 'dev',
};

const admins: Admin[] = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Doe' },
  { id: '3', name: 'Anna' },
  { id: '4', name: 'Peter' },
];

const customers: Customer[] = [
  { id: '5', name: 'Lucy' },
  { id: '6', name: 'Michael' },
  { id: '7', name: 'Sarah' },
  { id: '8', name: 'David' },
];

// Utils Functions
const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: 'Authorization header missing' });

  jwt.verify(token, secretKey, (err: unknown, decoded: unknown) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = decoded;
    next();
  });
};

const authenticateUser = (
  credentials: UserCredentials,
): { accessToken: string; refreshToken: string } | null => {
  const { role, password } = credentials;
  const storedPassword = validCredentials[role];

  if (!storedPassword || password !== storedPassword) return null;

  const accessToken = jwt.sign({ role }, secretKey, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ role }, refreshKey, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// Initializations
const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'secret';
const refreshKey = 'refreshSecret';

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_, res: Response) => {
  res.json({
    base_local_url: 'http://localhost:3000',
    base_online_url:
      'https://express-jwt-gallianoms-gallianoms-projects.vercel.app?_vercel_share=Yi2jUrNLFVVjInnPApEi825FlL1rtASY',
    routes: [
      { method: 'GET', path: '/api/login/ping', description: "Returns 'pong'" },
      {
        method: 'POST',
        path: '/api/login/authenticate',
        description: 'Authenticates user credentials and returns a JWT token',
        example_payload: { role: 'admin', password: 'admin' },
      },
      {
        method: 'POST',
        path: '/api/login/refresh-token',
        description: 'Refreshes the access token using the refresh token',
        example_payload: { refreshToken: 'yourRefreshToken' },
      },
      {
        method: 'GET',
        path: '/api/admin',
        description: 'Retrieves all admins (requires authentication)',
      },
      {
        method: 'GET',
        path: '/api/admin/:id',
        description:
          'Retrieves a specific admin by ID (requires authentication)',
      },
      {
        method: 'GET',
        path: '/api/customers',
        description: 'Retrieves all customers (requires authentication)',
      },
      {
        method: 'GET',
        path: '/api/customers/:id',
        description:
          'Retrieves a specific customer by ID (requires authentication)',
      },
    ],
  });
});

app.get('/api/login/ping', (_, res: Response) => {
  res.send('pong');
});

app.post('/api/login/authenticate', (req: Request, res: Response) => {
  try {
    const { role, password }: UserCredentials = req.body;
    const authResult = authenticateUser({ role, password });

    if (!authResult)
      return res.status(401).json({ message: 'Invalid credentials' });

    return res.status(200).json(authResult);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login/refresh-token', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    jwt.verify(refreshToken, refreshKey, (err: unknown, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Invalid or expired refresh token' });
      }

      const accessToken = jwt.sign({ role: decoded.role }, secretKey, {
        expiresIn: '15m',
      });

      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/admin', verifyToken, (_, res: Response) => {
  res.send({ data: admins });
});

app.get('/api/admin/:id', verifyToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = admins.find(admin => admin.id === id);

  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.send({ data: admin });
});

app.get('/api/customers', verifyToken, (_, res: Response) => {
  res.send({ data: customers });
});

app.get('/api/customers/:id', verifyToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = customers.find(customer => customer.id === id);

  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.send({ data: customer });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
