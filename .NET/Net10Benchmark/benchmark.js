import http from 'k6/http';
import { check, sleep } from 'k6';

// 🎓 EXAMENSARBETE CONFIGURATION
// Goal: Stress the GC (.NET) and Borrow Checker (Rust)
export const options = {
    stages: [
        { duration: '10s', target: 50 },   // Warm-up
        { duration: '30s', target: 500 },  // ⚡ HIGH LOAD (500 Concurrent Users)
        { duration: '10s', target: 0 },    // Cooldown
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // Pass if 95% of requests are < 500ms
    },
};

export default function () {
    // 👇 CHANGE THIS PORT TO SWITCH TARGETS
    // Rust = 3000
    // .NET = 5074
    const PORT = 5074;

    // Random page 1-1000 to prevent database caching
    const page = Math.floor(Math.random() * 1000) + 1;

    const res = http.get(`http://localhost:${PORT}/api/products?page=${page}&size=20`);

    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(0.01); // Very short sleep to maximize throughput
}
