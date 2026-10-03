-- =============================================================================
-- Bản tiếng Anh cho 19 trang thương hiệu
--
-- SINH TỰ ĐỘNG bởi scripts/gen-thuong-hieu-en-sql.mjs — đừng sửa tay file này,
-- sửa scripts/thuong-hieu-en.json rồi chạy lại script.
--
-- Thuật ngữ bám theo lib/i18n/glossary.ts.
--
-- en_status đặt là 'máy dịch': bản dịch đã được đọc và nắn chứ không phải chạy
-- máy thẳng, nhưng vẫn nên có người của KTĐ rà lại tên riêng và cách gọi sản
-- phẩm theo thói quen của khách nước ngoài. Rà xong thì đổi sang 'đã duyệt';
-- script dịch tự động sau này không được đụng vào những dòng đã duyệt.
--
-- Chạy sau 0009_trang_thuong_hieu.sql.
-- =============================================================================

-- MARTOR
update brands set
    intro_en    = 'MARTOR is a German manufacturer of safety cutting tools, based in Solingen with more than 80 years in professional cutting. The company concentrates on safety cutters, safety scissors, blades and accessories for industrial, warehousing and packaging environments. MARTOR solutions are designed to reduce the risk of hand injuries while limiting damage to the goods inside the packaging. KTD stocks MARTOR''s core ranges to cover everyday cutting in manufacturing, warehousing and logistics.',
    dong_sp_en  = array['Safety cutters: concealed blade, automatic or manual blade retraction', 'Safety scissors for frequent cutting work', 'Replacement blades and accessories matched to each cutter range']::text[],
    noi_bat_en  = array['Protection mechanisms matched to different levels of cutting risk', 'Designed around grip, operator protection and goods protection', 'Ranges for food, pharmaceutical and metal-detectable applications']::text[],
    ung_dung_en = array['Cutting cartons, tape and packaging materials', 'Cutting plastic film, shrink wrap, strapping and soft materials', 'Used in manufacturing, warehousing and packaging']::text[],
    en_status   = 'máy dịch'
where slug = 'martor';

-- KARNASCH
update brands set
    intro_en    = 'Karnasch Professional Tools is a German cutting tool brand with more than 60 years in metal machining. Its catalogue spans drilling, milling, threading, reaming and hole cutting, together with dedicated tooling for composite materials. KTD focuses on the main cutting tool ranges used in CNC machining, mould making, steel fabrication and production work that demands high accuracy. Karnasch sits in the high-performance segment, with a wide choice of tool substrates, cutting geometries and coatings for each application.',
    dong_sp_en  = array['Drill bits and end mills for metal machining', 'Taps, thread tools and precision reamers', 'Counterbores, hole saws and tooling for composite and honeycomb core']::text[],
    noi_bat_en  = array['Catalogue covering many stages of the cutting process', 'Wide choice of geometries, substrates and coatings per application', 'Dedicated tooling for hole cutting and composite materials']::text[],
    ung_dung_en = array['Drilling, milling, threading and reaming on CNC machines', 'Hole cutting in structural steel, plate and metal components', 'Mould machining, precision parts and composite materials']::text[],
    en_status   = 'máy dịch'
where slug = 'karnasch';

-- HARTNER
update brands set
    intro_en    = 'Hartner is a German manufacturer of precision cutting tools, founded in 1879 and with nearly a century and a half of experience in metal machining. The company develops tooling for drilling, milling, reaming and threading, from high-speed steel through solid carbide to high-performance solutions. KTD focuses on Hartner''s four main ranges: drill bits, end mills, thread tools and reamers. These suit CNC machining and production work that calls for accuracy, consistency and a choice of tooling matched to the workpiece material.',
    dong_sp_en  = array['High-speed steel and carbide drills, including deep-hole drills', 'End mills for CNC machining operations', 'Taps, thread tools and reamers for hole finishing']::text[],
    noi_bat_en  = array['A deep catalogue of precision cutting tools', 'Options for small holes, deep holes and high-accuracy holes', 'Standard tooling alongside solutions built to the machining requirement']::text[],
    ung_dung_en = array['Drilling, milling, threading and reaming on CNC machines', 'Finishing holes to the required size and surface quality', 'Machining steel, stainless, cast iron, aluminium and engineering materials']::text[],
    en_status   = 'máy dịch'
where slug = 'hartner';

-- HELICAL SOLUTIONS
update brands set
    intro_en    = 'Helical Solutions is a US high-performance cutting tool brand, part of Harvey Performance Company, specialising in solid carbide end mills for CNC machining. Its ranges are developed around specific materials and machining strategies, with choices of flute count, helix angle, variable pitch, end geometry and reach. KTD focuses on Helical end mills for roughing, finishing, high-efficiency machining and specialist profiles. The catalogue is particularly useful when tooling has to be chosen against a specific workpiece material and productivity target.',
    dong_sp_en  = array['Solid carbide end mills for roughing and finishing', 'End mills by material: aluminium, steel, stainless and difficult alloys', 'End mills for profiles, slots, deep pockets and 3D surfaces']::text[],
    noi_bat_en  = array['Specialists in high-performance end mills', 'Wide choice of flute counts, helix angles and variable pitch', 'Published cutting data to support tool selection and programming']::text[],
    ung_dung_en = array['Roughing, finishing and high-speed machining', 'Machining slots, pockets, profiles and 3D surfaces', 'Aerospace, automotive, medical and precision engineering components']::text[],
    en_status   = 'máy dịch'
where slug = 'helical';

-- COREHOG
update brands set
    intro_en    = 'CoreHog is a US cutting tool brand dedicated to composite and honeycomb core materials, part of Harvey Performance Company. The company designs tooling for materials that conventional cutters struggle with, particularly lightweight structures and multi-layer laminates. KTD supplies CoreHog''s composite and honeycomb tooling for roughing, forming, finish cutting and wall finishing. The products aim at stable, accurate machining with less surface damage on materials with demanding internal structures.',
    dong_sp_en  = array['Tools for roughing and forming honeycomb core', 'Finish cutting, edge trimming and core wall finishing tools', 'Tooling for composite panels and multi-layer laminates']::text[],
    noi_bat_en  = array['Purpose-built for composite and honeycomb core structures', 'Geometries matched to each material and each operation', 'Helps control the profile and limit surface damage']::text[],
    ung_dung_en = array['Roughing, forming and finishing honeycomb core', 'Trimming sandwich panels and composite materials', 'Machining lightweight structures in aerospace and industry']::text[],
    en_status   = 'máy dịch'
where slug = 'corehog';

-- ATA AIR TOOLS
update brands set
    intro_en    = 'ATA is an Irish industrial pneumatic tool brand with more than 50 years in grinding and surface finishing applications. The company supplies a range of grinders and sanders for professional production environments. KTD focuses on ATA Air Tools: pencil grinders, straight grinders, angle grinders and pneumatic sanders. The tools are built for work that calls for consistent stock removal, surface treatment and finishing, with attention to power-to-weight ratio, durability and operator comfort.',
    dong_sp_en  = array['Pneumatic grinders: pencil, straight and angle grinders', 'Pneumatic sanders for surface treatment and finishing']::text[],
    noi_bat_en  = array['Several tool formats for different access and stock removal rates', 'Attention to power, weight and feel in the hand', 'Pairs with matching carbide burrs, mounted points and abrasive discs']::text[],
    ung_dung_en = array['Deburring and grinding parts after machining or casting', 'Weld cleaning, sanding and surface finishing', 'Used in general engineering, automotive, aerospace and shipbuilding']::text[],
    en_status   = 'máy dịch'
where slug = 'ata';

-- MORRISFLEX
update brands set
    intro_en    = 'Morrisflex is a carbide burr brand originating in Ireland and now part of ATA Group. The company specialises in tungsten carbide burrs for stock removal, deburring and finishing parts after machining. The Morrisflex catalogue covers many head shapes, cut patterns, shank sizes and material-specific versions. KTD focuses on the Morrisflex carbide burr range for work on steel, stainless, non-ferrous metals, castings and complex profiles that conventional abrasives cannot reach.',
    dong_sp_en  = array['Carbide burrs in many head shapes and cut patterns', 'Long-shank and small-diameter burrs for hard-to-reach areas', 'Burrs matched to the material and the stock removal required']::text[],
    noi_bat_en  = array['Wide choice of shapes, shank sizes and cut configurations', 'Options for fast stock removal or fine finishing', 'Pairs with grinders at the correct speed and collet size']::text[],
    ung_dung_en = array['Deburring, profile correction and weld cleaning', 'Machining steel, stainless, cast iron, aluminium and non-ferrous metals', 'Finishing castings, moulds and engineered components']::text[],
    en_status   = 'máy dịch'
where slug = 'morrisflex';

-- GARRYSON
update brands set
    intro_en    = 'Garryson is a British brand within ATA Group, specialising in abrasives and carbide products for stock removal and surface finishing. KTD focuses on carbide burrs together with common abrasive lines such as flap discs, quick-change discs, flap wheels and finishing consumables. Garryson products are developed for work ranging from heavy grinding and weld dressing through to cleaning, blending and finishing. The catalogue suits plants and engineering workshops that need a broad abrasive system across several materials and finish levels.',
    dong_sp_en  = array['Flap discs, quick-change discs and flap wheels', 'Abrasive consumables and accessories for surface treatment and finishing']::text[],
    noi_bat_en  = array['Options for heavy grinding, blending and finishing', 'The FlexiDisc range suits curved surfaces and contours']::text[],
    ung_dung_en = array['Weld dressing, edge grinding and deburring', 'Removing rust, paint and old coatings, and preparing surfaces', 'Finishing components in general engineering, automotive and shipbuilding']::text[],
    en_status   = 'máy dịch'
where slug = 'garryson';

-- BEVELTOOLS
update brands set
    intro_en    = 'Beveltools is a manufacturer of metal chamfering and edge-breaking machines based in the Netherlands. The company builds handheld and bench machine platforms paired with chamfering and radius inserts designed for each level of work. KTD focuses on three main groups: handheld chamfering and deburring machines, bench machines, and inserts with accessories. Beveltools solutions aim at fast, repeatable weld edge preparation, radius forming and deburring on steel, stainless and aluminium, across plate, tube, holes and fabricated structures.',
    dong_sp_en  = array['Handheld chamfering and edge-breaking machines', 'Bench chamfering machines for parts brought to the cutting head', 'Chamfering inserts, radius inserts and replacement accessories']::text[],
    noi_bat_en  = array['Machine platforms from light work through to heavy chamfering', 'Inserts swapped to change the chamfer angle or the edge radius', 'Solutions for plate, tube, holes and fabricated structures']::text[],
    ung_dung_en = array['Weld edge preparation on steel, stainless and aluminium', 'Edge rounding and deburring after laser or plasma cutting', 'Chamfering plate, tube, holes and structural components']::text[],
    en_status   = 'máy dịch'
where slug = 'bevel-tools';

-- DIPROFIL
update brands set
    intro_en    = 'DIPROFIL is a Swedish manufacturer of precision filing, grinding and polishing machines and tools, with a history going back to 1950. The company is well known in mould making for its reciprocating filing and polishing machines, diamond and CBN tools, precision files and polishing stones. KTD focuses on the ranges used directly for mould finishing and bench work, where the operator needs fine control over surface and profile. The products suit injection moulds, die casting tools, forming tools and a wide range of precision engineering work.',
    dong_sp_en  = array['Reciprocating filing and mould polishing machines', 'Precision files, polishing stones and fine blending tools', 'Diamond and CBN tools for grinding and finishing']::text[],
    noi_bat_en  = array['Specialists in fine finishing of moulds and precision components', 'Machines and tools built for work on complex profiles', 'A choice of abrasive materials for each finishing stage']::text[],
    ung_dung_en = array['Filing, blending and polishing injection and die casting moulds', 'Fine grinding, deburring and reworking precision components', 'Finishing models and surfaces with hard-to-reach contours']::text[],
    en_status   = 'máy dịch'
where slug = 'diprofil';

-- BUCHEM
update brands set
    intro_en    = 'Buchem is a German manufacturer of technical chemicals with more than 40 years serving injection moulding, mould making and tool maintenance. KTD focuses on the products used for cleaning and maintaining moulds and the screw and barrel assemblies of injection moulding machines, including plastic residue removers, degreasers, corrosion inhibitors, lubricants and purging aids for the plasticising unit. Buchem products are developed and made in Germany, aimed at keeping moulds clean, limiting corrosion, reducing residue build-up and supporting material or colour changeovers in plastics production.',
    dong_sp_en  = array['Cleaners for moulds, plastic residue and plasticising units', 'Degreasers, corrosion inhibitors and mould preservatives', 'Lubricants for ejector pins, slides and mould mechanisms']::text[],
    noi_bat_en  = array['A catalogue dedicated to cleaning and maintenance in injection moulding', 'Solutions for residue, grease and leftover material', 'The Interkor ranges support screw and barrel cleaning']::text[],
    ung_dung_en = array['Cleaning mould cavities and equipment during maintenance', 'Purging during material or colour changeovers on moulding machines']::text[],
    en_status   = 'máy dịch'
where slug = 'buchem';

-- ROCKLIN
update brands set
    intro_en    = 'Rocklin Manufacturing is a US manufacturer of industrial equipment. Within KTD''s range, Rocklin covers two main product lines: Rocklinizer for treating metal surfaces, and MoldMender for repairing steel moulds. The Rocklinizer deposits material from an electrode onto the area being treated, to improve wear resistance, create grip or restore a component''s dimensions. MoldMender uses low-heat micro-welding to add material where a mould has been damaged. Both lines serve maintenance work and localised repair of tooling and moulds on the shop floor.',
    dong_sp_en  = array['Rocklinizer surface treatment units', 'MoldMender micro-welding units for mould repair', 'Electrodes, filler materials and matching accessories.']::text[],
    noi_bat_en  = array['The Rocklinizer treats surfaces locally by electro-spark deposition', 'Electrode material chosen for wear resistance, grip or dimensional restoration', 'MoldMender micro-welds at low heat input, keeping the repair zone controlled']::text[],
    ung_dung_en = array['Improving wear resistance on tooling, punches and moulds', 'Creating grip on clamping faces or restoring worn areas of a component', 'Repairing parting lines, edges, corners, pin holes and scratches on steel moulds']::text[],
    en_status   = 'máy dịch'
where slug = 'rocklinizer';

-- TSCHORN
update brands set
    intro_en    = 'Tschorn is a German manufacturer specialising in measuring and probing technology for the machining industry since 1986. Within KTD''s range, the focus is on 3D probes, touch probes, edge finders and zero-point setters for machine tools. These tools help the operator establish workpiece position, part edges, hole centres and height datums before or during machining. Tschorn develops and manufactures in Germany, with an emphasis on accuracy, intuitive handling and durability in the workshop.',
    dong_sp_en  = array['3D probes and touch probes for machine tools', 'Edge finders, centring tools and workpiece position checks', 'Zero-point setters and Z-axis height datums']::text[],
    noi_bat_en  = array['Tools dedicated to workpiece set-up and coordinate finding', '3D probes work across all three axes: X, Y and Z', 'Mechanical, optical and touch-based probing principles']::text[],
    ung_dung_en = array['Setting the zero point, finding edges and centring holes', 'Aligning workpiece position before CNC machining', 'Checking height datums and shortening set-up time']::text[],
    en_status   = 'máy dịch'
where slug = 'tschorn';

-- LENZKES
update brands set
    intro_en    = 'Lenzkes Spanntechnik is a German manufacturer of clamping technology, specialising in quick clamping systems for moulds, fixtures and machined components. KTD focuses on four main ranges: Multi-Quick quick clamps, S-Series clamping frames, edge clamps and chain clamps. Lenzkes solutions are designed to generate high clamping force through compact mechanical action, while several ranges allow flexible adjustment in both height and horizontal position. Applications run from injection moulding, stamping and casting through to CNC drilling and milling, and general workshop workholding.',
    dong_sp_en  = array['Multi-Quick quick clamps and S-Series clamping frames', 'Edge clamps for parts that need a clear machining surface', 'Chain clamps for components with awkward shapes']::text[],
    noi_bat_en  = array['Mechanical clamping systems for moulds, fixtures and workpieces', 'Position adjustment across the main clamping ranges', 'Designed for high clamping force with compact operation']::text[],
    ung_dung_en = array['Clamping injection, rubber and stamping moulds', 'Holding workpieces for CNC drilling, milling or grinding', 'Holding parts with surfaces or profiles that are difficult to clamp']::text[],
    en_status   = 'máy dịch'
where slug = 'lenzkes';

-- FIAM
update brands set
    intro_en    = 'Fiam is an Italian manufacturer of tightening equipment and industrial assembly solutions, developing since 1949. KTD focuses on handheld industrial screwdrivers, handheld screwdrivers with automatic screw feed, and automated screwdriving systems. The Fiam catalogue covers pneumatic, electric and electronic solutions, from manual operation through to modules integrated into production lines. The products are built to improve the repeatability of the tightening process, cut out the pick-and-place of each screw, and support productivity and ergonomics at assembly stations.',
    dong_sp_en  = array['Handheld industrial screwdrivers: pneumatic, electric and electronic', 'Handheld screwdrivers with integrated automatic screw feed', 'Modules and automated screwdriving systems for production lines']::text[],
    noi_bat_en  = array['Several tightening technologies for manual and machine-integrated work', 'Automatic screw feeding removes the pick-and-place step', 'Attention to torque, repeatability and ergonomics']::text[],
    ung_dung_en = array['Repeatable screw tightening at assembly stations', 'Electronics, appliance, automotive and mechanical assembly', 'Integrating screw feeding and tightening into machines and lines']::text[],
    en_status   = 'máy dịch'
where slug = 'fiam';

-- SLOKY
update brands set
    intro_en    = 'Sloky is a Taiwanese torque control tool brand, developed from the precision machining background of Chienfu-Tec. The Sloky torque screwdriver range is designed specifically for CNC machining, turning and milling, where insert clamping screws must be tightened repeatably to a defined torque. KTD supplies torque screwdrivers, tool kits and accessories such as handles, torque adapters and bits. The modular design allows quick bit changes, controls torque through rated adapters, and limits over-tightening that damages screws or tooling.',
    dong_sp_en  = array['Torque screwdrivers and handheld torque tool kits', 'Torque adapters across a range of rated settings', 'Handles, bits and replacement accessories by application']::text[],
    noi_bat_en  = array['Torque control when tightening cutting tool screws', 'Colour-coded adapters for quick identification', 'Modular design with a torque-reached indication']::text[],
    ung_dung_en = array['Tightening insert screws on CNC turning and milling tools', 'Changing tooling with repeatable torque to specification', 'Preventing screw and tool damage from over-tightening']::text[],
    en_status   = 'máy dịch'
where slug = 'sloky';

-- TECHNOMARK
update brands set
    intro_en    = 'Technomark is a French manufacturer of industrial marking and traceability solutions, founded in 2000. The company develops two main technologies, dot peen and laser marking, in portable, benchtop and line-integrated formats. KTD focuses on dot peen and laser marking machines used to mark industrial components directly. Technomark systems can produce text, numbers, serial numbers, logos, date codes, DataMatrix codes and QR codes on a range of materials, helping manufacturers identify parts and build traceability data through production.',
    dong_sp_en  = array['Dot peen markers: portable, benchtop and line-integrated', 'Laser markers as workstations and integrated into production']::text[],
    noi_bat_en  = array['Two main marking technologies: dot peen and laser', 'Configurations for shop-floor use or production integration', 'Supports characters, logos and codes for traceability']::text[],
    ung_dung_en = array['Marking serial numbers, batch numbers, specifications and logos', 'Marking QR and DataMatrix codes for traceability', 'Marking metal and plastic parts on the shop floor or in line']::text[],
    en_status   = 'máy dịch'
where slug = 'technomark';

-- TECNA
update brands set
    intro_en    = 'TECNA is an Italian manufacturer operating since 1972, well known in resistance welding and industrial load balancers. Within KTD''s range, TECNA products cover two areas: load balancers for suspended tools and loads, and test equipment for the parameters of the resistance welding process. The company''s testers work with a range of sensors to check welding current, electrode force and related quantities, while the balancers suspend and counterbalance tools, hoses or cables at the workstation to support safety and ergonomics.',
    dong_sp_en  = array['Load balancers for tools and suspended loads', 'Test equipment for resistance welding process parameters', 'Sensors and accessories for measuring welding current and electrode force']::text[],
    noi_bat_en  = array['Two areas: workstation ergonomics and weld process control', 'Balancers suspend and counterbalance tools at the station', 'Testers pair with the sensor matched to the quantity being checked']::text[],
    ung_dung_en = array['Suspending tools, hoses and cables on assembly lines', 'Measuring welding current and electrode force on resistance welding systems', 'Checking, maintaining and monitoring weld process quality']::text[],
    en_status   = 'máy dịch'
where slug = 'tecna';

-- RTC
update brands set
    intro_en    = 'RTC is the quick coupling brand of RTC Tec Bağlantı Elemanları Sanayi ve Ticaret A.Ş., based in Istanbul, Turkey. Founded in 2013, the company develops and manufactures single quick couplings, multi-line couplings, and solutions for hoses, manifolds and flow control. KTD focuses on the ranges for compressed air, water and hydraulics, particularly in applications that need fast connection and disconnection and the management of several fluid lines. RTC products are used in moulds, machinery and production lines to connect fluid circuits, shorten set-up time and control flow.',
    dong_sp_en  = array['Single quick couplings for water, compressed air and hydraulics', 'Multi-line couplings for several fluid circuits at once', 'Manifolds, hoses, flow controllers and accessories']::text[],
    noi_bat_en  = array['A quick-connection catalogue across common industrial fluids', 'Multi-line couplings cut connection and disconnection time', 'Matching hoses, manifolds and controllers available']::text[],
    ung_dung_en = array['Connecting mould cooling and temperature control water', 'Connecting compressed air and hydraulics on machines and fixtures', 'Grouping multiple lines and controlling flow on production lines']::text[],
    en_status   = 'máy dịch'
where slug = 'rtc';

-- Kiểm nhanh sau khi chạy:
--   select count(*) from brands where visible and intro_en is not null;   -- phải ra 19
--   select slug, en_status from brands where visible order by sort_order;
