//! NETWORK & PROXY DOMAIN
//! Tầng hạ tầng mạng trung gian độc lập với Chrome:
//! 1. Kiểm tra tốc độ & Sống/chết của Proxy (SOCKS5/HTTP/IPv6)
//! 2. Định vị GeoIP quốc gia, thành phố, ISP
//! 3. Máy chủ chuyển tiếp IPv6 Proxy nội bộ

pub mod proxy;
pub mod ipv6;

pub use proxy::ProxyService;
pub use ipv6::Ipv6ProxyServer;
