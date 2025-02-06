const allowedIps = [
  "127.0.0.1", // Localhost (IPv4)
  "::1", // Localhost (IPv6)
  "192.168.1.100",
  "192.168.18.79",
];

const restrictIp = (req, res, next) => {
  const clientIp =
    req.headers["x-forwarded-for"] || // Proxy header (if behind a proxy)
    req.connection.remoteAddress || // Classic way
    req.socket.remoteAddress || // Newer way
    req.ip; // Express way

  console.log("🔍 Incoming IP:", clientIp);

  // Normalize IPv6-mapped IPv4 addresses
  const normalizedIp = clientIp.includes("::ffff:")
    ? clientIp.split("::ffff:")[1]
    : clientIp;

  console.log("🔍 Normalized IP:", normalizedIp);

  if (allowedIps.includes(normalizedIp)) {
    return next();
  }

  res.status(403).json({ message: "Forbidden: Unauthorized IP address" });
};

module.exports = restrictIp;
