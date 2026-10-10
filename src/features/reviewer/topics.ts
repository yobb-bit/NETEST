export type StudyNote = {
  title: string;
  body: string;
  takeaways: string[];
};

export type StudyTopic = {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  objective: string;
  icon: string;
  tint: string;
  notes: StudyNote[];
};

// Original introductory notes organized around the 200-301 CCNA v1.1 domains.
// They are learning summaries, not official Cisco material.
export const topics: StudyTopic[] = [
  {
    slug: "network-fundamentals",
    number: "01",
    title: "Network fundamentals",
    shortDescription: "Models, media & devices",
    description: "Learn what common network devices do and how data moves between them.",
    objective: "200-301 CCNA v1.1 · Domain 1.0",
    icon: "◈",
    tint: "mint",
    notes: [
      {
        title: "Devices have different jobs",
        body: "A switch forwards Ethernet frames between devices on the same local network. A router connects different IP networks and chooses where to send packets next. An access point bridges wireless clients onto a wired network.",
        takeaways: [
          "Switches learn source MAC addresses and use them to make forwarding decisions.",
          "Routers examine destination IP addresses and consult a routing table.",
          "A default gateway is the router a host uses to reach destinations outside its local subnet.",
        ],
      },
      {
        title: "Frames and packets travel together",
        body: "As data moves through a network, each layer adds information needed by the next part of the journey. On a local Ethernet link, an IP packet is carried inside a frame. Routers remove the incoming link frame and place the packet into a new frame for the outgoing link.",
        takeaways: [
          "IP addresses identify the source and destination across networks.",
          "MAC addresses deliver a frame across one local link.",
          "The Layer 2 frame changes at each routed hop while the packet is forwarded onward.",
        ],
      },
    ],
  },
  {
    slug: "network-access",
    number: "02",
    title: "Network access",
    shortDescription: "Switching, VLANs & wireless",
    description: "See how switches connect endpoints and keep local traffic organized.",
    objective: "200-301 CCNA v1.1 · Domain 2.0",
    icon: "⌘",
    tint: "lavender",
    notes: [
      {
        title: "VLANs create separate Layer 2 networks",
        body: "A virtual LAN groups switch ports into separate broadcast domains. Hosts in different VLANs do not communicate through Layer 2 switching alone; they need a Layer 3 device to route between those networks.",
        takeaways: [
          "An access port normally carries traffic for one assigned VLAN.",
          "An 802.1Q trunk carries traffic for multiple VLANs and tags frames to identify their VLAN.",
          "VLAN membership and IP subnetting are separate settings that are commonly designed to align.",
        ],
      },
      {
        title: "Switches learn where devices are",
        body: "When a frame arrives, a switch records the source MAC address and the port where it was learned. It then checks the destination MAC address to decide which port should receive the frame. If the destination is not yet known, the switch floods the frame within that VLAN.",
        takeaways: [
          "The MAC address table maps learned MAC addresses to VLANs and switch ports.",
          "A switch learns from the source address, not the destination address.",
          "Broadcasts stay within their VLAN unless a router forwards related traffic at Layer 3.",
        ],
      },
    ],
  },
  {
    slug: "ip-connectivity",
    number: "03",
    title: "IP connectivity",
    shortDescription: "Routing & path selection",
    description: "Understand routes, next hops, and how routers move packets between networks.",
    objective: "200-301 CCNA v1.1 · Domain 3.0",
    icon: "⌁",
    tint: "blue",
    notes: [
      {
        title: "Routers choose the most specific route",
        body: "A router compares a packet's destination IP address with entries in its routing table. When several routes match, it uses the matching route with the longest prefix, because that route describes the narrowest destination range.",
        takeaways: [
          "A routing table can include connected, static, and dynamically learned routes.",
          "The next hop tells a router where to send a packet to continue its journey.",
          "A default route is used when no more specific matching route is available.",
        ],
      },
      {
        title: "A host decides whether to use its gateway",
        body: "A host uses its subnet mask or prefix length to determine whether a destination is local. For a local destination, it sends directly on the local link. For a remote destination, it sends the frame to its configured default gateway while keeping the remote IP as the packet destination.",
        takeaways: [
          "The host's IP address and prefix determine its local subnet.",
          "The default gateway must be reachable on the local network.",
          "The gateway's MAC address is used in the local Ethernet frame for remote traffic.",
        ],
      },
    ],
  },
  {
    slug: "ip-services",
    number: "04",
    title: "IP services",
    shortDescription: "DHCP, DNS, NAT & more",
    description: "Review common services that help hosts get configured and reach applications.",
    objective: "200-301 CCNA v1.1 · Domain 4.0",
    icon: "⎔",
    tint: "peach",
    notes: [
      {
        title: "DHCP supplies host configuration",
        body: "Dynamic Host Configuration Protocol (DHCP) can provide a host with an IP address, subnet mask or prefix, default gateway, and other settings such as DNS servers. A DHCP client commonly uses the discover, offer, request, acknowledge exchange to obtain a lease.",
        takeaways: [
          "A DHCP lease is time-limited and may be renewed.",
          "A DHCP relay forwards client requests when the server is on a different IP network.",
          "An incorrect address, gateway, or DNS setting can cause different connectivity symptoms.",
        ],
      },
      {
        title: "DNS translates names into addresses",
        body: "The Domain Name System (DNS) lets applications look up records such as the IP address associated with a host name. A client asks a configured resolver, which can answer from its cache or find the information through DNS queries.",
        takeaways: [
          "Successful IP connectivity does not guarantee that name resolution works.",
          "A DNS resolver address is commonly provided to clients through DHCP.",
          "Name lookup and packet forwarding are separate steps in reaching an application.",
        ],
      },
    ],
  },
  {
    slug: "security-fundamentals",
    number: "05",
    title: "Security fundamentals",
    shortDescription: "Access control & secure networks",
    description: "Start with the principles used to protect devices, users, and network traffic.",
    objective: "200-301 CCNA v1.1 · Domain 5.0",
    icon: "◇",
    tint: "rose",
    notes: [
      {
        title: "Limit access to what is needed",
        body: "Least privilege means giving users and systems only the access required for their tasks. In a network, access controls can restrict which traffic is allowed between devices or networks, reducing accidental exposure and limiting the reach of a compromised system.",
        takeaways: [
          "Use unique accounts and strong authentication for administrative access.",
          "Apply access rules deliberately and review their order and scope.",
          "Protect management access separately from ordinary user traffic where possible.",
        ],
      },
    ],
  },
  {
    slug: "automation-and-programmability",
    number: "06",
    title: "Automation & programmability",
    shortDescription: "APIs, data & network automation",
    description: "Explore how software can read network data and make repeatable changes.",
    objective: "200-301 CCNA v1.1 · Domain 6.0",
    icon: "⟡",
    tint: "gold",
    notes: [
      {
        title: "APIs make software-to-software requests possible",
        body: "An application programming interface (API) defines how one program can request information or an action from another. Network tools can use APIs to retrieve device state or apply planned changes in a consistent, repeatable way.",
        takeaways: [
          "An API describes available operations and the format of requests and responses.",
          "Structured data formats such as JSON make information easier for programs to parse.",
          "Automation still needs validation, access controls, and a way to review the changes it makes.",
        ],
      },
    ],
  },
];

export function getTopicBySlug(slug: string): StudyTopic | undefined {
  return topics.find((topic) => topic.slug === slug);
}
