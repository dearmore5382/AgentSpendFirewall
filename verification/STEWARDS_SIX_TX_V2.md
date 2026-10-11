# Six user-signed frontend lifecycle transactions

Contract: `0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d`  
Signer: `0xFf36b56CcA032C559e52e2A4F20c2C594B02Fe37`  
Records: charter `3`, invoice `4`, intent `4`.

1. Create charter — [`0x4eba605cfc84cf2bbca88efd152e56702cab640daaef1418b4145a4873ba11de`](https://explorer-studio.genlayer.com/tx/0x4eba605cfc84cf2bbca88efd152e56702cab640daaef1418b4145a4873ba11de)
2. Publish invoice — [`0x692f3236d2c8164f74726a308e423cc8981f3b73730c04a18c7f319bc96cac0b`](https://explorer-studio.genlayer.com/tx/0x692f3236d2c8164f74726a308e423cc8981f3b73730c04a18c7f319bc96cac0b)
3. Request intent — [`0x1c1e9f9c3d590b973abaa5c66a0813142dc233810799c4ebfa89eddaeae5a052`](https://explorer-studio.genlayer.com/tx/0x1c1e9f9c3d590b973abaa5c66a0813142dc233810799c4ebfa89eddaeae5a052)
4. Assess: `AUTHORIZED` — [`0xdadcae300f10a2fdeff02299294de083b86d0a270df9813dde0f4b003f424846`](https://explorer-studio.genlayer.com/tx/0xdadcae300f10a2fdeff02299294de083b86d0a270df9813dde0f4b003f424846)
5. Consume: `CONSUMED` — [`0x21432fb72b50879a44b0fe22cc7386f6e0466450305f899f756b6282b33d42b8`](https://explorer-studio.genlayer.com/tx/0x21432fb72b50879a44b0fe22cc7386f6e0466450305f899f756b6282b33d42b8)
6. Revoke: `CHARTER_REVOKED` — [`0x1240edfbb72ddfdc8ccc8fb2e2f0d8c570854f84b98a7832ba751eb81153a6b5`](https://explorer-studio.genlayer.com/tx/0x1240edfbb72ddfdc8ccc8fb2e2f0d8c570854f84b98a7832ba751eb81153a6b5)

All six are FINALIZED, successful GenVM returns, with at least three agree votes. Authoritative readbacks: charter REVOKED / spent `40`; intent CONSUMED; invoice consumed `true`; execution ticket `payment_verified=false`. This proves the chain lifecycle signed by the user. Explorer hashes do not independently record wallet prompts or intermediate frontend rendering.

