<?php 
require_once 'config.php';
require_once 'calculator.php'; 

$units = '';
$result = null;
$error = null;

// Handle Form Submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $units = filter_input(INPUT_POST, 'units', FILTER_VALIDATE_FLOAT);
    
    if ($units !== false && $units >= 0) {
        $result = calculateBill($units);
        
        try {
            $stmt = $pdo->prepare("INSERT INTO bill_history (units, total_amount) VALUES (:units, :amount)");
            $stmt->execute(['units' => $units, 'amount' => $result]);
            
            // Post-Redirect-Get pattern to prevent duplicate submissions on refresh
            header("Location: " . $_SERVER['PHP_SELF'] . "?status=success&latest=" . urlencode($result));
            exit;
        } catch (PDOException $e) {
            $error = "Database write error: " . $e->getMessage();
        }
    } else {
        $error = "Invalid input. Please supply a positive numerical value.";
    }
}

if (isset($_GET['status']) && $_GET['status'] === 'success') {
    $result = filter_input(INPUT_GET, 'latest', FILTER_VALIDATE_FLOAT);
}

// Fetch historical records
try {
    $stmt = $pdo->query("SELECT * FROM bill_history ORDER BY calculated_at DESC LIMIT 10");
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Reverse for chronological graph plot
    $graphData = array_reverse($history);
    
    // Quick summary stats for top KPI cards
    $totalLoggedUnits = array_sum(array_column($history, 'units'));
    $totalLoggedCost = array_sum(array_column($history, 'total_amount'));
    $avgUnits = count($history) > 0 ? $totalLoggedUnits / count($history) : 0;
} catch (PDOException $e) {
    $history = [];
    $graphData = [];
    $totalLoggedUnits = 0;
    $totalLoggedCost = 0;
    $avgUnits = 0;
}

// Format data arrays for ChartJS insertion
$graphLabels = array_map(fn($row) => date('M d, H:i', strtotime($row['calculated_at'])), $graphData);
$graphUnits  = array_map(fn($row) => (float)$row['units'], $graphData);
$graphCosts  = array_map(fn($row) => (float)$row['total_amount'], $graphData);
?>

<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PowerPulse — Utility Consumption Analytics</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS & Chart.js -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        brand: {
                            50: '#f0fdf4',
                            500: '#22c55e',
                            600: '#16a34a',
                            900: '#14532d',
                        },
                        dark: {
                            bg: '#0B0F17',
                            card: '#111827',
                            border: '#1F2937',
                            hover: '#1E293B'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-dark-bg text-slate-200 min-h-screen font-sans antialiased selection:bg-brand-500 selection:text-black">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Application Header -->
        <header class="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-dark-border gap-4">
            <div>
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-brand-500/10 text-brand-500 ring-1 ring-brand-500/20 font-bold text-sm">
                        ⚡
                    </span>
                    <h1 class="text-2xl font-extrabold tracking-tight text-white">PowerPulse</h1>
                    <span class="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">v2.4</span>
                </div>
                <p class="text-slate-400 text-sm mt-1">Live utility load monitoring and tariff billing telemetry.</p>
            </div>

            <!-- Header Quick Action / Dynamic Indicators -->
            <div class="flex items-center gap-3">
                <div class="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border flex items-center gap-2">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                    <span class="text-xs font-mono text-slate-300">System Engine Active</span>
                </div>
            </div>
        </header>

        <!-- KPI Metrics Ribbon -->
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-slate-700 transition duration-200">
                <div class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Meter Logs</div>
                <div class="text-2xl font-black text-white font-mono"><?php echo count($history); ?> <span class="text-xs font-sans text-slate-500 font-normal">entries</span></div>
            </div>
            <div class="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-slate-700 transition duration-200">
                <div class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Avg Consumption</div>
                <div class="text-2xl font-black text-white font-mono"><?php echo number_format($avgUnits, 1); ?> <span class="text-xs font-sans text-slate-500 font-normal">kWh/log</span></div>
            </div>
            <div class="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-slate-700 transition duration-200">
                <div class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Gross Tracked Cost</div>
                <div class="text-2xl font-black text-brand-500 font-mono">Rs. <?php echo number_format($totalLoggedCost, 2); ?></div>
            </div>
        </section>

        <!-- Main Workspace Grid -->
        <main class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- LEFT PANEL: Interactive Calculator & Reference (4 Cols) -->
            <div class="lg:col-span-4 space-y-6">
                
                <!-- Calculator Box -->
                <div class="bg-dark-card rounded-xl border border-dark-border p-6 relative overflow-hidden">
                    <h2 class="text-lg font-bold text-white mb-1">Calculate & Record</h2>
                    <p class="text-xs text-slate-400 mb-6">Enter metric load parameters to generate line billing.</p>

                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST" class="space-y-5">
                        <div>
                            <label for="units" class="block text-xs font-medium text-slate-300 mb-2">
                                Units Consumed (<span class="text-brand-500">kWh</span>)
                            </label>
                            <div class="relative">
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    name="units" 
                                    id="units" 
                                    value="<?php echo htmlspecialchars($units); ?>" 
                                    placeholder="0.00" 
                                    required 
                                    class="w-full bg-dark-bg text-white font-mono placeholder:text-slate-600 px-4 py-3 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition duration-200"
                                >
                                <span class="absolute right-3 top-3.5 text-xs text-slate-500 font-mono">kWh</span>
                            </div>

                            <!-- Interactive Input Preset Chips -->
                            <div class="flex items-center gap-2 mt-3">
                                <span class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Presets:</span>
                                <button type="button" onclick="setPreset(45)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition">45</button>
                                <button type="button" onclick="setPreset(120)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition">120</button>
                                <button type="button" onclick="setPreset(220)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition">220</button>
                                <button type="button" onclick="setPreset(350)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition">350</button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            class="w-full bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                            Compute & Submit
                        </button>
                    </form>

                    <!-- Alert Output State -->
                    <?php if ($error): ?>
                        <div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                            <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                            <span><?php echo htmlspecialchars($error); ?></span>
                        </div>
                    <?php endif; ?>

                    <?php if ($result !== null): ?>
                        <div class="mt-4 p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                            <div class="text-[10px] uppercase tracking-wider font-mono text-brand-500 font-bold mb-1">Calculation Output</div>
                            <div class="flex justify-between items-baseline">
                                <span class="text-xs text-slate-400">Total Payable:</span>
                                <span class="text-2xl font-black text-white font-mono">Rs. <?php echo number_format($result, 2); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Reference Slabs Widget -->
                <div class="bg-dark-card rounded-xl border border-dark-border p-5">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tariff Structure Reference</h3>
                    <div class="space-y-2 text-xs font-mono">
                        <div class="flex justify-between p-2 rounded bg-dark-bg border border-dark-border/50 text-slate-300">
                            <span>0 – 50 Units</span>
                            <span class="text-brand-500 font-bold">Rs. 3.50 / u</span>
                        </div>
                        <div class="flex justify-between p-2 rounded bg-dark-bg border border-dark-border/50 text-slate-300">
                            <span>51 – 150 Units</span>
                            <span class="text-brand-500 font-bold">Rs. 4.00 / u</span>
                        </div>
                        <div class="flex justify-between p-2 rounded bg-dark-bg border border-dark-border/50 text-slate-300">
                            <span>151 – 250 Units</span>
                            <span class="text-brand-500 font-bold">Rs. 5.20 / u</span>
                        </div>
                        <div class="flex justify-between p-2 rounded bg-dark-bg border border-dark-border/50 text-slate-300">
                            <span>> 250 Units</span>
                            <span class="text-brand-500 font-bold">Rs. 6.50 / u</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- RIGHT PANEL: Chart Visualization & Dynamic Ledger (8 Cols) -->
            <div class="lg:col-span-8 space-y-6">
                
                <!-- Chart Container -->
                <div class="bg-dark-card rounded-xl border border-dark-border p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-lg font-bold text-white">Consumption Telemetry</h2>
                            <p class="text-xs text-slate-400">Sequential metric trend plot over historical inputs.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="inline-block w-3 h-3 rounded-full bg-brand-500"></span>
                            <span class="text-xs font-mono text-slate-400">kWh Load</span>
                        </div>
                    </div>

                    <div class="relative w-full h-64">
                        <canvas id="consumptionChart"></canvas>
                    </div>
                </div>

                <!-- History Ledger -->
                <div class="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                    <div class="p-5 border-b border-dark-border flex items-center justify-between">
                        <h2 class="text-base font-bold text-white">Historical Ledger</h2>
                        <span class="text-xs text-slate-400 font-mono">Last 10 records</span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-dark-bg/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-dark-border">
                                    <th class="p-4">Log ID</th>
                                    <th class="p-4">Timestamp</th>
                                    <th class="p-4">Volume (kWh)</th>
                                    <th class="p-4 text-right">Computed Cost</th>
                                    <th class="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-dark-border text-xs">
                                <?php if (empty($history)): ?>
                                    <tr>
                                        <td colspan="5" class="p-8 text-center text-slate-500">
                                            No billing telemetry recorded in data store.
                                        </td>
                                    </tr>
                                <?php else: ?>
                                    <?php foreach ($history as $index => $row): ?>
                                        <tr class="hover:bg-dark-hover transition duration-150 group">
                                            <td class="p-4 font-mono text-slate-500 group-hover:text-slate-300">
                                                #<?php echo str_pad($row['id'], 4, '0', STR_PAD_LEFT); ?>
                                            </td>
                                            <td class="p-4 text-slate-400">
                                                <?php echo date('M d, Y · H:i', strtotime($row['calculated_at'])); ?>
                                            </td>
                                            <td class="p-4 font-mono text-white font-semibold">
                                                <?php echo number_format($row['units'], 2); ?>
                                            </td>
                                            <td class="p-4 font-mono font-bold text-brand-500 text-right">
                                                Rs. <?php echo number_format($row['total_amount'], 2); ?>
                                            </td>
                                            <td class="p-4 text-center">
                                                <button 
                                                    type="button"
                                                    onclick="printReceipt('<?php echo str_pad($row['id'], 4, '0', STR_PAD_LEFT); ?>', '<?php echo date('M d, Y - h:i A', strtotime($row['calculated_at'])); ?>', '<?php echo number_format($row['units'], 2); ?>', '<?php echo number_format($row['total_amount'], 2); ?>')"
                                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition font-mono text-[11px]"
                                                    title="Print Receipt"
                                                >
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                                                    Print
                                                </button>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- Client Scripting -->
    <script>
        // Preset fill utility
        function setPreset(val) {
            const input = document.getElementById('units');
            input.value = val;
            input.focus();
        }

        // Print Receipt Handler
        function printReceipt(id, timestamp, units, total) {
            const receiptWindow = window.open('', '_blank', 'width=450,height=600');
            
            const receiptHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt_#${id}</title>
                    <style>
                        body {
                            font-family: 'Courier New', Courier, monospace;
                            width: 320px;
                            margin: 20px auto;
                            padding: 20px;
                            border: 1px dashed #333;
                            color: #111;
                            background: #fff;
                        }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .bold { font-weight: bold; }
                        .divider { border-top: 1px dashed #000; margin: 12px 0; }
                        .row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px; }
                        .total-box { font-size: 16px; margin-top: 10px; }
                        .footer { font-size: 11px; margin-top: 20px; text-align: center; color: #555; }
                        @media print {
                            body { border: none; margin: 0; width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="text-center">
                        <h2 style="margin: 0;">POWERPULSE UTILITIES</h2>
                        <p style="margin: 4px 0; font-size: 12px;">Electricity Billing Telemetry</p>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="row">
                        <span>Receipt ID:</span>
                        <span class="bold">#${id}</span>
                    </div>
                    <div class="row">
                        <span>Date/Time:</span>
                        <span>${timestamp}</span>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="row">
                        <span>Units Consumed:</span>
                        <span class="bold">${units} kWh</span>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="row total-box">
                        <span class="bold">TOTAL AMOUNT:</span>
                        <span class="bold">Rs. ${total}</span>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="footer">
                        <p>Thank you for using PowerPulse Services.</p>
                        <p>*** Computer Generated Invoice ***</p>
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() { window.close(); };
                        };
                    <\/script>
                </body>
                </html>
            `;

            receiptWindow.document.write(receiptHTML);
            receiptWindow.document.close();
        }

        // Initialize Telemetry Chart
        document.addEventListener("DOMContentLoaded", function () {
            const ctx = document.getElementById('consumptionChart').getContext('2d');
            
            const labelsData = <?php echo json_encode($graphLabels); ?>;
            const unitsData = <?php echo json_encode($graphUnits); ?>;

            // Canvas Gradient Setup
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
            gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labelsData,
                    datasets: [{
                        label: 'Units Consumed (kWh)',
                        data: unitsData,
                        borderColor: '#22c55e',
                        borderWidth: 2,
                        backgroundColor: gradient,
                        tension: 0.2,
                        fill: true,
                        pointBackgroundColor: '#0B0F17',
                        pointBorderColor: '#22c55e',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#111827',
                            titleColor: '#F3F4F6',
                            bodyColor: '#22c55e',
                            borderColor: '#1F2937',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            bodyFont: { family: 'JetBrains Mono' },
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y + ' kWh';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(31, 41, 55, 0.6)' },
                            ticks: { 
                                color: '#9CA3AF',
                                font: { family: 'JetBrains Mono', size: 10 } 
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { 
                                color: '#9CA3AF',
                                font: { family: 'JetBrains Mono', size: 10 } 
                            }
                        }
                    }
                }
            });
        });
    </script>
</body>
</html>