using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MyBlog.Models.Articles;
using MyBlog.Models.Account;
using System.Xml.Linq;
using My_Blog.Models.Articles;

namespace My_Blog.Data
{
    /// <summary>
    /// Initializes database with default users and products.
    /// </summary>
    public static class DbInitializer
    {

        public static async Task Initialize(MyBlogContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            var executionStrategy = context.Database.CreateExecutionStrategy();

            void UpdateDatabase<T>(ICollection<T> list, DbSet<T> dbset, string? tableName = null) where T : class
            {
                if (dbset.Any()) return;


                executionStrategy.Execute(() =>
                {
                    using var transaction = context.Database.BeginTransaction();

                    if (tableName != null) context.Database.ExecuteSqlRaw($"SET IDENTITY_INSERT [dbo].[{tableName}] ON");

                    dbset.AddRange(list);

                    context.SaveChanges();
                    if (tableName != null) context.Database.ExecuteSqlRaw($"SET IDENTITY_INSERT [dbo].[{tableName}] OFF");
                    transaction.Commit();
                });
            }


            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "a",
                    Email = "a@a.com"
                };

                await userManager.CreateAsync(user, "Zk000000!");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@a.com"
                };

                await userManager.CreateAsync(admin, "Zk000000!");
                await userManager.AddToRolesAsync(admin, new string[] { "Member", "Admin" });

            }

            if (!roleManager.Roles.Any())
            {
                await roleManager.CreateAsync(new Role { Name = "Member", NormalizedName = "MEMBER" });
                await roleManager.CreateAsync(new Role { Name = "Admin", NormalizedName = "ADMIN" });
            }


            var articles = new List<Article>
            {
                new()
                {
                    Id = 1,
                    Date  = DateTime.Parse("2023-02-19 09:10:36.673"),
                    Title="Test 1",
                    Body = "Test"
                },
                new()
                {
                    Id = 2,
                    Date  = DateTime.Parse("2023-02-20 09:10:36.673"),
                    Title="Test 2",
                    Body = "Test"
                },
                new()
                {
                    Id = 3,
                    Date  = DateTime.Parse("2023-02-21 09:10:36.673"),
                    Title="Test 3",
                    Body = "Test"
                },
                new()
                {
                    Id = 4,
                    Date  = DateTime.Parse("2023-02-22 09:10:36.673"),
                    Title="Test 4",
                    Body = "Test"
                },
                new()
                {
                    Id = 5,
                    Date  = DateTime.Parse("2023-02-23 09:10:36.673"),
                    Title="Test 5",
                    Body = "Test"
                },
                new()
                {
                Id = 46,
                Date = DateTime.Parse("2022-11-17 10:34:10.760"),
                Title="Stocks with Five-letter Tickers",
                Body="List of common stocks with five-letter tickers listed by NYSE, NASDAQ and CBOE (BATS), excluding:\r\n\r\n- warrants, tradable rights, units and preferred shares\r\n- common stock tickers containing punctuations, like \"BRK.B\"\r\n\r\n## List of Companies by Market Cap\r\n| Symbol | Exchange | Exchange Name | Name | Market Cap (billions) |\r\n| ------ | -------- | ------------------ | ---------------------------------------------------------------- | --------------------- |\r\n| GOOGL | XNAS | Nasdaq All Markets | Alphabet Inc - Class A | 1321.29 |\r\n| CMCSA | XNAS | Nasdaq All Markets | Comcast Corp - Class A | 134.52 |\r\n| RYAAY | XNAS | Nasdaq All Markets | Ryanair Holdings Plc - ADR | 14.78 |\r\n| LSXMK | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock - SiriusXM) Series C | 13.60 |\r\n| LSXMA | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock - SiriusXM) Series A | 13.60 |\r\n| LSXMB | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock - SiriusXM) Series B | 13.60 |\r\n| FWONA | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock -Liberty Formula 1) Series A | 13.59 |\r\n| FWONK | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock -Liberty Formula 1) Series C | 13.59 |\r\n| FCNCA | XNAS | Nasdaq All Markets | First Citizens Bancshares, Inc (NC) - Class A | 13.42 |\r\n| LBRDK | XNAS | Nasdaq All Markets | Liberty Broadband Corp - Series C | 11.53 |\r\n| LBRDA | XNAS | Nasdaq All Markets | Liberty Broadband Corp - Series A | 11.51 |\r\n| RUSHB | XNAS | Nasdaq All Markets | Rush Enterprises Inc - Class B | 2.70 |\r\n| RUSHA | XNAS | Nasdaq All Markets | Rush Enterprises Inc - Class A | 2.70 |\r\n| CENTA | XNAS | Nasdaq All Markets | Central Garden & Pet Co. - Class A | 2.00 |\r\n| IMKTA | XNAS | Nasdaq All Markets | Ingles Markets, Inc. - Class A | 1.71 |\r\n| LILAK | XNAS | Nasdaq All Markets | Liberty Latin America Ltd - Class C | 1.70 |\r\n| BATRA | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock - Braves) Series A | 1.61 |\r\n| BATRK | XNAS | Nasdaq All Markets | Liberty Media Corp. (Tracking Stock - Braves) Series C | 1.61 |\r\n| FORTY | XNAS | Nasdaq All Markets | Formula Systems (1985) Ltd. - ADR | 1.23 |\r\n| QRTEA | XNAS | Nasdaq All Markets | Qurate Retail Inc - Series A | 0.85 |\r\n| QRTEB | XNAS | Nasdaq All Markets | Qurate Retail Inc - Series B | 0.82 |\r\n| CRESY | XNAS | Nasdaq All Markets | Cresud - ADR | 0.60 |\r\n| BELFB | XNAS | Nasdaq All Markets | Bel Fuse Inc. - Class B | 0.37 |\r\n| BELFA | XNAS | Nasdaq All Markets | Bel Fuse Inc. - Class A | 0.37 |\r\n| VLGEA | XNAS | Nasdaq All Markets | Village Super Market, Inc. - Class A | 0.31 |\r\n| UONEK | XNAS | Nasdaq All Markets | Urban One Inc - Class D | 0.22 |\r\n| LTRPB | XNAS | Nasdaq All Markets | Liberty TripAdvisor Holdings Inc - Series B | 0.18 |\r\n| LTRPA | XNAS | Nasdaq All Markets | Liberty TripAdvisor Holdings Inc - Series A | 0.18 |\r\n\r\n## Stocks Information\r\n\r\n### GOOGL Alphabet Inc - Class A\r\n\r\nAlphabet Inc. is the parent company of Google and several former Google subsidiaries.\r\n\r\n- GOOGL, Alphabet Inc - Class A shares, have one vote per share.\r\n- GOOG, Alphabet Inc - Class C shares have no voting rights.\r\n- Alphabet Inc - Class B shares are held by founders and insiders, confering 10 votes per share. Class B cannot be publicly traded.\r\n\r\n### CMCSA Comcast Corp - Class A\r\n\r\nComcast is the largest American multinational telecommunications conglomerate. Comcast is made up of three parts.\r\n\r\n- The core cable business, which owns networks capable of providing television, internet access, and phone services to roughly 61 million U.S. homes and businesses, or nearly half of the country.\r\n- NBCUniversal, which owns several cable networks, including CNBC, MSNBC, and USA, the NBC broadcast network, several local NBC affiliates, Universal Studios, and several theme parks.\r\n- Sky, which is the dominant television provider in the U.K.\r\n\r\nComcast is also the largest pay-television provider in Italy and has a presence in Germany and Austria.\r\n\r\n- Comcast - Class B shares are held entirely by held by founders and insiders. The Class B stock constitutes an undilutable 33.33% of the voting power.\r\n\r\n### RYAAY Ryanair Holdings Plc - ADR\r\n\r\nRyanair DAC is an Irish ultra low-cost carrier. As of June 30, 2022, it had a fleet of 483 Boeing 737 aircrafts and 29 Airbus A320 aircrafts; and offered 3,000 short-haul flights per day serving 225 airports.\r\n\r\n### Liberty Media Corp.\r\n\r\nLiberty Media Corporation is an American mass media company. The company has three divisions: Formula One, SiriusXM and Atlanta Braves. Liberty has issued tracking stocks for each of the 3 divisions \r\n\r\n- Formula One (FWONA, FWONK)\r\n- SiriusXM (LSXMA, LSXMB, LSXMK), and\r\n- The Atlanta Braves Major League Baseball team (BATRA, BATRK).\r\n\r\nEach stock has A, B and C Series:\r\n- Series A shares have 1 vote per share\r\n- Series B shares have 10 votes per share\r\n- Series C shares are non-voting\r\n- Series B are traded on the OTC Markets\r\n\r\n### FCNCA First Citizens Bancshares, Inc (NC) - Class A\r\n\r\nFirst Citizens Bancshares is the holding parent company of First Citizen Bank. In 2019, 72% of the bank's deposits were in North Carolina and South Carolina.\r\n\r\n### RUSHA/RUSHB Rush Enterprises Inc - Class A/B\r\n\r\nRush Enterprises, Inc. operates as an integrated retailer of commercial vehicles and related services in the United States. The company operates a network of commercial vehicle dealerships under the Rush Truck Centers name.\r\n\r\n### CENTA - Central Garden & Pet Co. - Class A\r\n\r\nCentral Garden & Pet Company produces and distributes various products for the lawn and garden, and pet supplies markets in the United States. It operates through two segments, Pet and Garden.\r\n\r\n### IMKTA - Ingles Markets, Inc. - Class A\r\n\r\nIngles Markets, Incorporated operates a chain of supermarkets in the southeast United States. As of September 25, 2021, the company operated 189 supermarkets under the brand name Ingles, and nine supermarkets under the brand name Sav-Mor in western North Carolina, western South Carolina, northern Georgia, eastern Tennessee, southwestern Virginia, and northeastern Alabama, as well as 111 pharmacies and 107 fuel stations.\r\n\r\n### FORTY - Formula Systems (1985) Ltd. - ADR\r\n\r\nFormula Systems is am Israeli publicly holding company. Through its subsidiaries, it provides proprietary and non-proprietary software solutions, IT professional services, software product marketing and support, and computer infrastructure and integration solutions worldwide.\r\n\r\n### VLGEA - Village Super Market, Inc. - Class A\r\n\r\nVillage Super Market, Inc. operates a chain of supermarkets in the United States. The company operates a chain of 34 supermarkets under the ShopRite and Fairway banners in New Jersey, New York, Maryland, and Pennsylvania; and four the Gourmet Garage specialty markets in New York City.\r\n\r\n### UONEK, Urban One Inc - Class D\r\n\r\nUrban One, Inc., together with its subsidiaries, operates as an urban-oriented multi-media company in the United States. The company operates through four segments: Radio Broadcasting, Cable Television, Reach Media, and Digital. As of December 31, 2021, it owned and/or operated 64 broadcast stations, including 54 FM or AM stations, 8 HD stations, and the 2 low power television stations under the Radio One tradename located in 13 urban markets.\r\n\r\n- UONE, Urban One Inc- Class A shares have one vote per share.\r\n- UONEK, Urban One Inc - Class D shares have no voting rights.\r\n\r\n## Sources\r\n\r\n- Symbols: IEX Cloud APIs\r\n- Market Caps: yFinance (Yahoo! Finance)\r\n\r\n## Notes\r\n\r\n### IEX Cloud symbol.json types\r\n\r\n```\r\nwt: warrant\r\nrt: tradable right\r\nut: unit\r\nps: preferred shares\r\ncs: common stocks\r\nadr: adr\r\n```\r\n"
                },
                new ()
                {
                    Id=47,
                    Date = DateTime.Parse("2022-11-17 14:40:35.220"),
                    Title="About the Blog",
                    Body="The blog application allows users (me) to write, post and manages\r\narticles. A new article can be created either by writing it directly in\r\nMarkdown format, or by uploading an existing Markdown file. A Markdown\r\npreview is provided alongside with the markdown input, making it easier\r\nfor users to write or edit. Markdown images syntax is supported so that\r\nusers can upload a Markdown file with accompanied images together.\r\n\r\n<img src=\"image1.png\" style=\"width:7in;height:3.83056in\"\r\nalt=\"Graphical user interface, application, email Description automatically generated\" />\r\n\r\nThe blog is developed with React as frontend and ASP.NET Core as\r\nbackend.\r\n\r\n## Create/Edit Articles\r\n\r\nTo create or edit an article, a user can follow the steps below:\r\n\r\n1.  Log into the application and go to Create or Edit page.\r\n\r\n2.  Drag Markdown file and images folder together and drop onto the\r\n    page.\r\n\r\n> <img src=\"image2.png\"\r\n> style=\"width:6.08941in;height:3.2803in\"\r\n> alt=\"Graphical user interface, application Description automatically generated\" />\r\n\r\n3.  When texts and images are uploaded, add tags if required.\r\n\r\n<img src=\"image3.png\"\r\nstyle=\"width:6.14813in;height:3.66448in\"\r\nalt=\"Graphical user interface, text, application Description automatically generated\" />\r\n\r\n4.  Check if images are well-displayed, add/change images if required.\r\n\r\n<img src=\"image4.png\"\r\nstyle=\"width:6.32508in;height:3.6639in\" />\r\n\r\n5.  Post the article.\r\n\r\nIt may come handy to use *pandoc* to convert articles in .docx to .md\r\nand extract embedded images. An example of pandoc command can be:\r\n\r\n    pandoc ./README.docx –to=gfm -o README.md –extract-media=_readme\r\n\r\nNote:\r\n\r\n- Users can download written markdown text by clicking “Save” button.\r\n\r\n- Clicking image names copy image name in markdown format, such as\r\n  `![example_1]( example_1.png), `to clipboard.\r\n\r\n## Markdown Format\r\n\r\nGitHub Flavored Markdown (gfm) is chosen as the dialect for Markdown\r\nformat. Math equations and raw html tags are also supported.\r\n\r\n## Security\r\n\r\nA user needs to be logged in as administrator to be able to perform CRUD\r\noperations.\r\n\r\n## Other Features\r\n\r\n- Abstract of articles are loaded and displayed initially, full articles\r\n  can be fetched and displayed by clicking “more” button. The full\r\n  articles can be collapsed.\r\n\r\n- Clicking tags will filter articles by tags’ names.\r\n\r\n- Clicking sidebar’s email address will copy it to clipboard.\r\n\r\n- Users can choose to be “stayed logged in”\r\n\r\n## Resources\r\n\r\n- React 17.0.2\r\n\r\n- ASP.NET Core 6.0.13\r\n\r\n- .NET Packages: ASP.NET Core Identity, EF Core, etc.\r\n\r\n- React Packages: react-markdown, react-icons, react-router, rectstrap,\r\n  remark, rehype, etc."
                },
                new ()
                {
                    Id=63,
                    Date = DateTime.Parse("2023-02-06 11:16:10.967"),
                    Title="Financial Assets Manager",
                    Body="Financial Assets Manager is a portfolio tracking and performance\r\nmeasurement tool. It allows users to track their investments in various\r\nfinancial assets, including stocks, ETFs, mutual funds, Forex, and\r\nsavings account. Users can import historical trades and incomes from\r\nmultiple brokers, or they can be entered manually. The tool also\r\nprovides performance metrics such as returns, dividends, and capital\r\ngains, as well as tax reporting for users in Australia.\r\n\r\nFinancial Assets Manager is currently Excel and Csv based for user\r\ninteractions and uses Python 3 for development.\r\n\r\n## Converters\r\n\r\nConverters transform trades, incomes, products, Australian Attribution\r\nManaged Investment Trusts (AMIT) data to uniform formats and save them\r\nto relevant data stores. The requirement and description of the formats\r\ncan be found below under Manal Inputs section.\r\n\r\nBroker converters transform trades and incomes data. Supported brokers\r\nincludes Stake (Australia), Interactive Brokers, and Tian Tian Fund\r\n(China). Exports from Sharesight are also supported. Trades and incomes\r\ndata obtained from brokers need to be placed in the\r\n`Converters/``inputs` folder. Any additional data can be entered in\r\n`inputs/Manual Inputs.xlsx` file.\r\n\r\nThe converted outputs are shown in `Converted Ouputs.xlsx`, which gives\r\nusers an opportunity to check and modify the data before saving it into\r\ndata store. As for now, the data store consists of several csv files.\r\n\r\n### Conversion Rules for Forex Trades\r\n\r\nA forex trade is split into a buy trade and a sell trade for accounting\r\npurposes. Namely, a forex trade is converted into:\r\n\r\n- Buying X units of long/short forex pair product\r\n\r\n- Selling X units of the product at the same time.\r\n\r\n‘.S’ or ‘.L’, which represent ‘Short’ or ‘Long’ respectively, is\r\nappended to product’s Code.\r\n\r\nFor example, a trade converting 1000 AUD into 770.96 USD, with a\r\ncommission of 4.38 is spit into the following:\r\n\r\n<img src=\"image1.png\" style=\"width:6in;height:0.43056in\"\r\nalt=\"Forex trade image\" />\r\n\r\nFor AUDUSD trade pair, it is equivalent to buying 770.96 units of Short\r\nAUDUSD product, which costs 1000 AUD, and selling 770.96 units for\r\n770.96 USD.\r\n\r\nForex trades from Interactive Brokers are automatically split. When\r\nentering manual forex trades, the splitting rule needs to be followed.\r\n\r\n### Exchange Rates\r\n\r\nIf exchange rates for foreign trades and incomes are not provided,\r\n*daily* exchange rates are used. The daily exchange rates are obtained\r\nby `forex_python` and saved in `/``inputs/``exchange_rate.pkl`.\r\n\r\n### Broker Data\r\n\r\nRules for brokers’ exported data and manually input data.\r\n\r\n#### Stake (Australia)\r\n\r\n1.  Go to Account – Tax Documents - Account Summary Report\r\n\r\n2.  Select date range and format as Excel (.xlsx)\r\n\r\n3.  Get the `AUSSummary.xlsx` from email and place it in the inputs\r\n    folder.\r\n\r\nNote: only share trades are imported from Stake’s report as its\r\ndividends report currently does not provide enough franking information\r\nfor ETFs.\r\n\r\n#### Interactive Brokers (IB)\r\n\r\n1.  Go to the Reports - Flex Queries\r\n\r\n2.  Create a new Flex Query\r\n\r\n    1.  Select Trades and Transactions under Sections\r\n\r\n    2.  Select Executions and tick SELECT ALL. Click Save.\r\n\r\n    3.  Keep the default Query Name “TradesAndTransactions”.\r\n\r\n3.  Change Date Format to “yyyy-mm-dd”.\r\n\r\n4.  Click Create\r\n\r\n5.  Run the Activity Flex Query\r\n\r\n    1.  Set Format as CSV, click Run.\r\n\r\n    2.  Place the downloaded “TradesAndTransactions.csv” in the inputs\r\n        folder.\r\n\r\nNote: share trades, dividends, IB interests, and forex are imported.\r\n\r\n#### Sharesight\r\n\r\n1.  Go to the Reports – Tax and Compliance – All Trades\r\n\r\n2.  Select Date Range\r\n\r\n3.  Click Google Doc icon.\r\n\r\n4.  In Google Doc spreadsheet, press ctrl-A to exclusively select all\r\n    trades. Copy.\r\n\r\n5.  Paste it in `inputs/Sharesight Export.xlsx` – trades sheet.\r\n\r\n6.  Go to the Reports – Tax and Compliance – Taxable income.\r\n\r\n7.  Click Google Doc icon.\r\n\r\n8.  In Google Doc spreadsheet, press ctrl-A to exclusively select all\r\n    trades. Copy.\r\n\r\n9.  Paste it in `inputs/Sharesight Export.xlsx` – incomes sheet.\r\n\r\nNote: as for 20230126, the All Trades exported xlsx file shows xml\r\nerrors in Excel. Therefore, data copied from Google Docs spreadsheets\r\nare use.\r\n\r\n#### Tian Tian Fund (China)\r\n\r\n1.  账号页面左侧交易查询 – 我的对账单\r\n\r\n2.  对账单查询月账单选择年月\r\n\r\n3.  选择并复制所有历史交易明细\r\n\r\n4.  粘贴至`inputs/``Tiantian`` ``Inputs``.xlsx`的trades表\r\n\r\n5.  选择并复制历史分红明细中非货币基金的分红\r\n\r\n6.  粘贴至`inputs/Tiantian`` ``Inputs``.xlsx`的incomes表\r\n\r\n### Manual Input Data\r\n\r\n`Manual ``input.xlsx` has four sheets: trades, incomes, amit_annual and\r\nproducts. They contain the exact same fields as those can be found in\r\ndata store.\r\n\r\n#### trades\r\n\r\nEquity and Forex trades that cannot be converted are to be entered here.\r\n\r\nOnly 'Exchange Rate AUD', 'Original Id' and 'Comments' columns are\r\noptional. ‘Value’ for sell trades means ‘cash received’; for buy trades,\r\n‘cash paid’.\r\n\r\n<img src=\"image2.png\" style=\"width:6in;height:0.69306in\"\r\nalt=\"Manual Input Data trades\" />\r\n\r\n#### incomes\r\n\r\nAustralian dividends and savings are to be entered here.\r\n\r\nThe table below shows incomes sheet’s column and whether the column is\r\nrequired.\r\n\r\n| **Columns**         | **Required for**               | **Info**                      |\r\n|---------------------|--------------------------------|-------------------------------|\r\n| Paid Date           | All                            |                               |\r\n| Market              | All                            |                               |\r\n| Code                | All                            |                               |\r\n| Ex Date             | AMIT dividends only            |                               |\r\n| Type                | All                            | Dividends or Savings          |\r\n| Currency            | All                            |                               |\r\n| Net Amount          | All                            | Cash Received                 |\r\n| Franking Credits    | All Australian dividends       |                               |\r\n| Gross Dividend      | All dividends                  | Net Amount + Franking Credits |\r\n| Qualified Quantity  | Optional                       |                               |\r\n| Dividends per Share | All dividends                  |                               |\r\n| Exchange Rate AUD   | Optional                       |                               |\r\n| Franked Amount      | All Australian share dividends |                               |\r\n| Unfranked Amount    | All Australian share dividends |                               |\r\n\r\nAll other fields are optional.\r\n\r\n#### amit_annual\r\n\r\nAMIT Annual Tax Statement’s data are to be entered here.\r\n\r\nThe table below shows amit_annual sheet’s column names, corresponding\r\nATO codes and whether the column is required.\r\n\r\n| Column Name                                                                                                | Required     | ATO Code |\r\n|------------------------------------------------------------------------------------------------------------|--------------|----------|\r\n| Share of net income from trusts, less capital gains, foreign income and franked distributions              | Yes          | 13U      |\r\n| Franked distributions from trusts                                                                          | Yes          | 13C      |\r\n| Share of franking credit from franked dividends                                                            | Yes          | 13Q      |\r\n| Share of credit for tax file number amounts withheld from interest, dividends and unit trust distributions | Optional     | 13R      |\r\n| Net capital gain                                                                                           | Yes          | 18A      |\r\n| Total current year capital gains                                                                           | Yes          | 18H      |\r\n| Assessable foreign source income                                                                           | Yes          | 20E      |\r\n| Other net foreign source income                                                                            | Yes          | 20M      |\r\n| Foreign income tax offset                                                                                  | Yes          | 20O      |\r\n| AMIT Cost Base Decrease                                                                                    | Yes. Either. |          |\r\n| AMIT Cost Base Increase                                                                                    |              |          |\r\n\r\n#### products\r\n\r\nProduct data should be entered here.\r\n\r\nProduct data contains information of each financial asset product,\r\nincluding code, name, capitalization, etc. They are to be stored in\r\n`/_data/``product.csv`. Currently, these data are to be entered\r\nmanually, following the rules stated below.\r\n\r\n##### Market and Code\r\n\r\n- For Chinese mutual funds, Market is always “CNF” and Code is prefixed\r\n  with “C”. For example, CNF C001717\r\n\r\n- <img src=\"image3.png\"\r\n  style=\"width:2.7608in;height:0.36463in\" alt=\"Market and Code\" />\r\n\r\n- For forex trades, Code needs to be in the format like “AUDUSD.L” where\r\n  ‘.S’ or ‘.L’ in Code represents ‘Short’ or ‘Long’ respectively.\r\n\r\n- For savings, Code is always “INT” which stands for “Interest”, and\r\n  Market can be any letters that represent the institution that issues\r\n  the savings account product.\r\n\r\n##### Asset Region\r\n\r\n- For ETFs and mutual funds, asset region can be multiple countries or a\r\n  general description like “Developed Countries”. If it is multiple\r\n  countries, country names should be separated with semicolon.\r\n\r\n##### Sector and subsector\r\n\r\n- For blended ETFs and mutual funds, sector can be “Blend Stocks”,\r\n  “Blend Bonds” or “Hybrid Bonds”.\r\n\r\n## Reports\r\n\r\nFinancial Assets Manager can report the following:\r\n\r\n- Australian Tax from financial assets, including capital gain and\r\n  income tax.\r\n\r\n- All transactions, including all incomes and trades.\r\n\r\n- A portfolio for all existing equities.\r\n\r\n- Weekly profit/loss\r\n\r\n### Capital Gains\r\n\r\nCapital gains of equity sell trades are calculated using First-In First\r\nOut methods. Namely, the first buy trade is used to match the first sell\r\ntrade to calculate capital gain in a given period. This may result a\r\nmatched trade pair in falling into the category of “Short term capital\r\ngain”, “Long term capital gain” or “Capital loss” for tax purposes,\r\ndepending on the time difference of buy and sell trade.\r\n\r\nThe process of calculating capital gains of a trade pair methods is\r\nroughly:\r\n\r\n1.  Sorts buy trades by time oldest first.\r\n\r\n<!-- -->\r\n\r\n2.  Sorts sell trades by time oldest first.\r\n\r\n<img src=\"image4.png\"\r\nstyle=\"width:3.51389in;height:1.52467in\" alt=\"Capital Gains 1\" />\r\n\r\n3.  Splits buy trades and sell trades so that each buy-sell pair has the\r\n    same size.\r\n\r\n<img src=\"image5.png\"\r\nstyle=\"width:4.03472in;height:1.78993in\" alt=\"Capital Gains 2\" />\r\n\r\n4.  Calculates capital gain and time difference for each pair.\r\n\r\n#### AMIT Capital Gains Adjustment\r\n\r\nAMIT Capital Gains Adjustment are considered only for Australia tax\r\npurposes.\r\n\r\nThe AMIT cost base adjustments is reported yearly. According to ATO, the\r\nannual AMIT cost base increase/decrease should be evenly applied to all\r\neligible units given by:\r\n\r\n\r\n$$\r\n\\ All\\ Eligible\\ Units = \\ all\\ units\\ held\\ on\\ July\\ 1st\\  + \\ units\\ bought\\ from\\ July\\ 1st\\ until\\ June\\ 30th\\ \r\n$$\r\n\r\n\r\nhttps://community.ato.gov.au/s/question/a0J9s000000ONBIEA4/p00200319?referrer=a0N9s000000DacCEAS\r\n\r\nTherefore, AMIT Cost Base Adjustment per unit for a Trust in a given\r\nyear can be calculated by\r\n\r\n\r\n$$\r\nAMIT\\ CB\\ Adj\\ per\\ unit = \\frac{AMIT\\ CB\\ Increase - AMIT\\ CB\\ Decrease}{All\\ Eligible\\ Units}\r\n$$\r\n\r\n\r\nFor a particular buy trade of the same Trust, the aggregate AMIT cost\r\nBase Adjustment is the sum of AMIT Cost Base Adjustments per unit for\r\neach year after the buy date, multiplied by quantity.\r\n\r\n\r\n$$\r\nAMIT\\ CB\\ Adj = \\sum_{after\\ buy\\ date}^{}{AMIT\\ CB\\ Adj\\ per\\ unit}*quantity\\ \r\n$$\r\n\r\n\r\n#### Discounted Capital Gain Distributions\r\n\r\nDiscounted Capital Gain from Distributions are also reported yearly.\r\nThey are considered when calculating capital gains in tax reports only.\r\n\r\n### Australian Tax Reports\r\n\r\nAustralian Tax Reports consists of an Excel file Tax.xlsx and Jupyter\r\nNotebook file. The Tax.xlsx shows a table containing items and values\r\nneeded by ATO when filling individual tax return. The Excel file is\r\nproduced by the Jupyter Notebook file which also shows more details on\r\nthe items in Excel.\r\n\r\n### Capital Gains Tax\r\n\r\nTax.xlsx cg tax sheet shows accounting calculations of capital gains.\r\nFor example,\r\n\r\n<img src=\"image6.png\"\r\nstyle=\"width:5.88889in;height:1.86016in\"\r\nalt=\"Capital Gains Tax Report 1\" />\r\n\r\nJupyter Notebook lists trade pairs that contribute to each type of\r\ngains, as well as Discounted Capital Gain from Distributions. For\r\nexample,\r\n\r\n<img src=\"image7.png\" style=\"width:6in;height:2.51319in\"\r\nalt=\"Capital Gains Tax Report 1\" />\r\n\r\n### Income Tax\r\n\r\nTax.xlsx income tax sheet shows ATO required items for filing income tax\r\nrelated to financial assets (including interests from savings accounts).\r\nFor example,\r\n\r\n<img src=\"image8.png\"\r\nstyle=\"width:5.17361in;height:3.20747in\" alt=\"Income Tax Report 1\" />\r\n\r\nSimilarly, the Jupyter Notebook lists data of incomes that contribute to\r\neach ATO required items. For example,\r\n\r\n<img src=\"image9.png\" style=\"width:6in;height:1.66944in\"\r\nalt=\"Income Tax Report 2\" />\r\n\r\n### All transactions\r\n\r\nAll transactions shows equity trades, forex trades, and incomes from\r\ndividends and savings in a readable format. Net gains for equity sell\r\ntrades are calculated using FIFO method stated above without considering\r\nAMIT adjustments. Sell trades within one day are merged together for\r\nclarity.\r\n\r\n<img src=\"image10.png\"\r\nstyle=\"width:5.89233in;height:0.70449in\" alt=\"All transactions\" />\r\n\r\nFranking credits and foreign tax withheld are not included in Cash.\r\n\r\n### Weekly Summary\r\n\r\nWeekly summary displays weekly total profit loss of all trades and total\r\ninterest incomes separately. A week is defined as starting from Monday,\r\nwhich is shown in Date, to Sunday.\r\n\r\n<img src=\"image11.png\" style=\"width:6in;height:0.9in\"\r\nalt=\"Weekly Summary\" />\r\n\r\n### Portfolio\r\n\r\nPortfolio records information on open balance equities, including\r\nholding quantities, average price, cost base etc. Current price of a\r\nholding is its last price. For Australian and US shares, last prices are\r\nobtained via yfinance, whereas Chinese mutual fund price are fetched\r\nfrom Tiantian’s website using a custom web scrawler.\r\n\r\n<img src=\"image12.png\" style=\"width:6in;height:0.39167in\"\r\nalt=\"Portfolio\" />\r\n\r\nThe calculated fields PL, PL% and current value are evaluated by:\r\n\r\n\r\n$$\r\nCurrent\\ Value = Current\\ Price*Quantity\r\n$$\r\n\r\n\r\n\r\n$$\r\nPL = Current\\ Value - Cost\\ Base\r\n$$\r\n\r\n\r\n\r\n$$\r\nPL\\% = \\frac{PL}{Cost\\ Base}\r\n$$\r\n\r\n\r\n## Resources\r\n\r\n### Libraries\r\n\r\n- pandas\r\n\r\n- forex_python\r\n\r\n- yfinance\r\n\r\n- BeautifulSoup\r\n\r\n### Price Data\r\n\r\n- 天天基金 ’http://fund.eastmoney.com/{Code}.html’\r\n- ASX and US shares: `yfinance`"
                },
                new ()
                {
                    Id = 64,
                    Date = DateTime.Parse("2023-02-08 03:23:20.137"),
                    Title = "Log Converter",
                    Body="Log converter transforms abbreviated texts for logging daily activities\r\nand health information into formal formats, which are subsequently used\r\nto generate summarizing reports.\r\n\r\nThe process is shown below:\r\n<img src=\"image1.png\" style=\"width:7in;height:5.26597in\"\r\nalt=\"Log converter process\" />\r\n\r\n1.  User copies abbreviated texts into `input.txt` as input.\r\n\r\n2.  Log converter converts input into `converted.xlsx.`\r\n\r\n3.  User checks `converted.xlsx` and adds more data if desired.\r\n\r\n- If an activity’s abbreviation is not found in activity rules (defined\r\n  in `activity_rules.py`), then user should either check the input or\r\n  add a rule for the abbreviation to activity rules.\r\n\r\n4.  User saves converted into database (csv files)\r\n\r\n- If duplicated entries are found, then user should check input and\r\n  converted data for duplication.\r\n\r\n5.  Log converter uses data from database and generates activity and\r\n    health reports.\r\n\r\n## Input Format\r\n\r\n**Activity format:**\r\n\r\n    [abbreviation][minutes] [notes]\r\n\r\n- e.g., `abs30`, which means “weight training on abs for 30 minutes.”\r\n\r\n- no spacing in between `[abbreviation]` and` [minutes]`, one\r\n  space before `[notes]`\r\n\r\nOr if an activity has s default value in `activity_rules.py`\r\n\r\n    [abbreviation]\r\n\r\n**Sleep time format**\r\n\r\n    [sleep1][wake1] [sleep2][wake2] \r\n\r\n- e.g., `23300500 01450655`, which means sleep 1 was 23:00 – 05:00\r\n  and sleep was 01:45 – 06:55\r\n\r\n<!-- -->\r\n\r\n- one space between each pair of `[sleep][wake]`\r\n\r\n**Weight format:** keep one decimal place in kg, e.g.,`63.2`.\r\n\r\n**Post-meal Condition format:**\r\n\r\n    [morning][noon][evening]\r\n\r\n- e.g., `134`\r\n\r\n- `[morning][noon][evening]` should all be integers from 0 to 9.\r\n\r\n- no spacing in between\r\n\r\n### Example\r\n\r\n    1\r\n    acc30\r\n    bic40\r\n    bck20\r\n    pyd290\r\n    str10\r\n    23300500 01450155 06000730\r\n    63.2\r\n    223\r\n\r\n## Activity Rules\r\n\r\n`activity_rules.py` defines rules for activities in `activity_rules` and\r\ndefault activities in `default_activities`. Default activities are added\r\nto every day's activities automatically.\r\n\r\n`activity_rules` is a dictionary of key-value pairs, whose keys are\r\nabbreviations of activity names and values are lists in the format of\r\n`[Activity Details, Activity Name, Category, Default Time, Factor]`.\r\nFor example:\r\n\r\n    'cook': ['Cooking', 'Life Skills', 'Improve', None, 0.9]\r\n\r\n- `DefaultTime` and Factor can be `None`\r\n\r\n- Factors are used to multiply activity’s times. Factors should be a\r\n  number larger than 0.\r\n\r\nFor example,\r\n\r\n`default_activities` is a list of activity abbreviations. For\r\nexample,\r\n\r\n    [\"diet\", \"noalc\", 'nosmk', 'slp']\r\n\r\nThe corresponding activities have not-none `DefaultTime`\r\n\r\n## Reports\r\n\r\n`report.xlsx` have two sheets containing detailed data of activities\r\nand health data information respectively.\r\n\r\nIn “Activity” sheet, daily total and the weekly average of daily totals\r\nare calculated and added. In “Health” sheet, the followings are added:\r\n\r\n| **Column Names**    | **Description**                                 |\r\n|---------------------|-------------------------------------------------|\r\n| Sleep First         | First sleep time for a day== sleep 1            |\r\n| Wake Last           | Last wake up time for a day== wake X            |\r\n| Sleep Total         | Total sleep duration for a day                  |\r\n| Meal Total          | Sum of all post-meal condition values for a day |\r\n| Sleep First Average | Weekly average of First Sleep Time              |\r\n| Wake Last Average   | Weekly average of Wake First                    |\r\n| Sleep Total Average | Weekly average of Sleep Total                   |\r\n| Meal Total Average  | Weekly average of Meal Total                    |\r\n\r\nReport are formatted as exemplified below:\r\n\r\n*Activity Sheet*\r\n\r\n<img src=\"image2.png\" style=\"width:7in;height:1.88125in\"\r\nalt=\"Activity Sheet Example\" />\r\n\r\n*Health Sheet*\r\n\r\n<img src=\"image3.png\" style=\"width:7in;height:0.91042in\"\r\nalt=\"Health Sheet Example\" />\r\n\r\n## Resource\r\n\r\n- Python libraries: pandas, numpy, openpyxl"
                },
                new ()
                {
                    Id = 65,
                    Date = DateTime.Parse("2023-02-09 09:09:36.673"),
                    Title = "Account Converter",
                    Body="Account converter transforms banks transactions history data and manual\r\ninputs into a preset format. For example,\r\n\r\nNab transaction history: <img src=\"image1.png\"\r\nstyle=\"width:6.93053in;height:1.54699in\"\r\nalt=\"Nab Transaction History Example\" />\r\n\r\nConverted format:\r\n\r\n<img src=\"image2.png\"\r\nstyle=\"width:6.0849in;height:1.93232in\"\r\nalt=\"Converted Format Example\" />\r\n\r\n## Process\r\n\r\n<img src=\"image3.png\" style=\"width:7in;height:3.86944in\"\r\nalt=\"Account Converter Process\" />\r\n\r\n1.  User downloads Transaction.csv from National Australia Bank Online\r\n    Banking\r\n\r\n2.  Account Converter converts Transaction.csv to `converted.xlsx.`\r\n\r\n3.  User checks converted data and manually adds more data into\r\n    `account.xlsx` if required.\r\n\r\n4.  User saves converted into database (csv files)\r\n\r\n- If invalid entries are found, then user should check converted data.\r\n\r\n5.  `converted.xlsx` is now valid and can be used for book-keeping.\r\n\r\n## Account Rules\r\n\r\n`activity_rules.py` defines mappings in used when converting bank’s\r\ntransaction history.\r\n\r\nMERCHANT_RULES is a dictionary that sets custom string for the field\r\n“Details” in converted data, which are used to replace NAB's merchant\r\nnames. Key-value pairs should follow the format below:\r\n\r\n‘Nab Merchant Name’: ‘Custom Details String’\r\n\r\nFor example,\r\n\r\n>     merchant_rules = {\r\n>\r\n>     'the Lott': 'Lottery Purchase'\r\n>\r\n>     }\r\n\r\nCATEGORY_RULES sets custom category names which are used to replace\r\ncorresponding NAB's category names. Key-value pairs should follow the\r\nformat below:\r\n\r\n    ‘Nab Category Name’: ‘Custom Category Name’\r\n\r\nFor example,\r\n\r\n>      category_rules = {\r\n>\r\n>     'Food & drink': 'Dining',\r\n>\r\n>     'Bills': 'Utilities'\r\n>\r\n>     }\r\n\r\nmerchant_category_rules defines how “Details” in converted data should\r\nmatch categories. Key-value pairs should follow the format below:\r\n\r\n    ‘Custom Details String’: ‘Custom Category’\r\n\r\nFor example,\r\n\r\n>       merchant_category_rules = {\r\n>\r\n>     'the Lott': 'Investment',\r\n>\r\n>     'Medibank': 'Health',\r\n>\r\n>     'YouTube': 'Entertainment'\r\n>\r\n>       }\r\n\r\n## Notes\r\n\r\n- Date in NAB’s transaction history is not necessarily the actual date\r\n  when the transaction occurred. The actual date is usually contained in\r\n  the Info field. As a result, actual date is parsed from Info field if\r\n  possible. If not, then Date field is used.\r\n\r\n- Some transactions in NAB’s transaction history may not have Details,\r\n  or some may have categories such as “Transfer In” that cannot be\r\n  categorized programmatically. The users are expected to manually add\r\n  or modify these transactions.\r\n\r\n## Resource\r\n\r\n- Python libraries: pandas, numpy, openpyxl"
                }
            };

            var articleTags = new List<ArticleTag>
            {
                 new() {
                     ArticleId = 1,
                     TagId=1
                 },
                 new() {
                     ArticleId = 2,
                     TagId=1
                 },
                 new() {
                     ArticleId = 3,
                     TagId=1
                 },
                 new() {
                     ArticleId = 4,
                     TagId=1
                 },
                 new() {
                     ArticleId = 5,
                     TagId=1
                 },
                 new() {
                     ArticleId =  46,
                     TagId=16
                 },
                 new()
                 {
                     ArticleId =  63,
                     TagId=17
                 },
                 new()
                 {
                     ArticleId =  63,
                     TagId=16
                 },
                 new()
                 {
                     ArticleId =  47,
                     TagId=28
                 },
                new()
                 {
                     ArticleId =  47,
                     TagId=29
                 }
            };

            var tags = new List<Tag>
            {
                new ()
                {
                    Id= 1,
                    Name="Test"
                },
                new ()
                {
                    Id= 16,
                    Name="Investment"
                },
                new ()
                {
                    Id= 17,
                    Name="Python"
                },
                new ()
                {
                    Id= 28,
                    Name="React"
                },
                new ()
                {
                    Id= 29,
                    Name="ASP.NET Core"
                }
            };

            var comments = new List<Comment>
            {
                new ()
                {
                    ArticleId = 1,
                    UserId = 1,
                    Body="Test Comment",
                    Date= DateTime.Now,
                },
                new ()
                {
                    ArticleId = 1,
                    UserId = 2,
                    Body="Test Comment",
                    Date= DateTime.Now.AddDays(1),
                },
            };

            var articleLikes = new List<ArticleLike>
            {
                new ()
                {
                    ArticleId = 1,
                    UserId = userManager.Users.First(user=>user.UserName=="a").Id,
                },
                new ()
                {
                    ArticleId = 1,
                    UserId = userManager.Users.First(user=>user.UserName=="admin").Id,
                },
            };


            UpdateDatabase(articles, context.Articles, "MyBlogArticles");
            UpdateDatabase(tags, context.Tags, "MyBlogTags");
            UpdateDatabase(articleTags, context.ArticleTags);
            UpdateDatabase(comments, context.Comments);
            UpdateDatabase(articleLikes, context.ArticleLikes);
        }
    }
}